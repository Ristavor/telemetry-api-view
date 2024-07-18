import { ref, onMounted, Ref } from "vue";
import * as joint from "jointjs";
import { DynamicShape, createShape } from "../shapes";
import { useContextMenu } from "./useContextMenu";
import { useSelection } from "./useSelection";
import { usePanningAndZooming } from "./usePanningAndZooming";
import { fetchAlgorithms, sendAlgorithmData } from "../services/api";

export function useCanvas(
  canvasContainer: Ref<HTMLDivElement | null>,
  canvas: Ref<HTMLDivElement | null>
) {
  let paper: joint.dia.Paper;
  let graph: joint.dia.Graph;

  const {
    contextMenuVisible,
    contextMenuPosition,
    showContextMenu,
    hideContextMenu,
  } = useContextMenu();
  const { selectedCell, selectedCellProperties, selectCell, deselectCell } =
    useSelection();

  const linkSource = ref<joint.dia.Element | null>(null);
  const availableShapes = ref<
    Array<{ type: string; create: () => DynamicShape }>
  >([]);

  onMounted(async () => {
    const algorithms = await fetchAlgorithms();
    availableShapes.value = Object.keys(algorithms).map((type) => ({
      type,
      create: () => createShape(type, algorithms[type], type, "#ff0000", type),
    }));

    if (canvas.value && canvasContainer.value) {
      graph = new joint.dia.Graph();

      paper = new joint.dia.Paper({
        el: canvas.value,
        model: graph,
        width: canvasContainer.value.clientWidth,
        height: canvasContainer.value.clientHeight,
        gridSize: 10,
        drawGrid: true,
        background: {
          color: "rgba(0, 255, 0, 0.3)",
        },
      });

      paper.on("element:contextmenu", (elementView, evt) => {
        evt.preventDefault();
        selectCell(elementView.model); // Select the cell on right click
        showContextMenu(evt, canvasContainer.value as HTMLElement);
      });

      paper.on("element:pointerdown", (elementView, evt) => {
        if (evt.ctrlKey) {
          if (linkSource.value) {
            if (linkSource.value.id !== elementView.model.id) {
              // Prevent linking to itself
              const link = new joint.shapes.standard.Link({
                source: { id: linkSource.value.id },
                target: { id: elementView.model.id },
              });
              link.addTo(graph);
            }
            linkSource.value = null;
          } else {
            linkSource.value = elementView.model;
          }
        } else {
          selectCell(elementView.model);
        }
      });

      paper.on("link:contextmenu", (linkView, evt) => {
        evt.preventDefault();
        linkView.model.remove(); // Remove the link on right click
      });

      paper.on("blank:pointerdown", () => {
        deselectCell();
        linkSource.value = null;
      });

      const { enableZooming, enablePanning } = usePanningAndZooming(
        canvasContainer.value,
        paper
      );
      enableZooming();
      enablePanning();

      document.addEventListener("click", (event) => {
        if (
          contextMenuVisible.value &&
          !(event.target as HTMLElement).closest(".context-menu")
        ) {
          hideContextMenu();
        }
      });
    }
  });

  const addShapeToCanvas = (shapeType: string) => {
    const shapeInfo = availableShapes.value.find(
      (shape) => shape.type === shapeType
    );
    if (!shapeInfo) return;

    const shape = shapeInfo.create();
    shape.position(150, 150); // Position the shape at the center
    shape.attr("body/strokeDasharray", ""); // Set default border style to solid
    graph.addCell(shape);
  };

  const updateSelectedCell = (properties: {
    name: string;
    color: string;
    params: BlockParams;
    inputData: string;
  }) => {
    if (selectedCell.value) {
      selectedCell.value.attr("label/text", properties.name);
      selectedCell.value.attr("body/fill", properties.color);
      selectedCell.value.set("params", properties.params);
      selectedCell.value.set("inputData", properties.inputData);
      selectedCellProperties.value = {
        ...properties,
        data: selectedCell.value.get("data"),
      };
    }
  };

  const duplicateCell = () => {
    if (selectedCell.value) {
      const clone = selectedCell.value.clone();
      clone.position(
        selectedCell.value.position().x + 20,
        selectedCell.value.position().y + 20
      ); // Offset the position of the clone
      // Устанавливаем те же атрибуты и параметры для клона
      clone.attr(selectedCell.value.attributes.attrs);
      clone.set("params", { ...selectedCell.value.get("params") });
      clone.set("inputData", selectedCell.value.get("inputData"));
      clone.set("data", selectedCell.value.get("data")); // Копируем данные
      clone.attr("body/strokeDasharray", ""); // Сбрасываем границу у клона
      graph.addCell(clone);
      contextMenuVisible.value = false;
    }
  };

  const deleteCell = () => {
    if (selectedCell.value) {
      selectedCell.value.remove();
      contextMenuVisible.value = false;
      deselectCell();
    }
  };

  const start = () => {
    if (selectedCell.value) {
      const cellData = selectedCell.value.get("data");
      const outgoingLinks = graph.getConnectedLinks(selectedCell.value, {
        outbound: true,
      });
      outgoingLinks.forEach((link) => {
        const targetId = link.get("target").id;
        if (targetId) {
          const targetCell = graph.getCell(targetId) as DynamicShape;
          if (targetCell) {
            targetCell.receiveData(cellData);
          }
        }
      });
    }
  };

  const resolve = async () => {
    if (selectedCell.value) {
      const algorithmName = selectedCell.value.attr("label/text");
      const params = selectedCell.value.get("params");
      const inputData = selectedCell.value.get("inputData");
      const response = await sendAlgorithmData(
        algorithmName,
        params,
        inputData
      );
      selectedCell.value.set("data", response);
      selectedCellProperties.value = {
        ...selectedCellProperties.value!,
        data: response,
      };
    }
  };

  return {
    contextMenuVisible,
    contextMenuPosition,
    addShapeToCanvas,
    updateSelectedCell,
    duplicateCell,
    deleteCell,
    hideContextMenu,
    selectedCellProperties,
    start,
    resolve,
  };
}
