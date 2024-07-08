import { ref, onMounted, Ref } from "vue";
import * as joint from "jointjs";
import { BaseShape, ShapeA, ShapeB, ShapeC } from "../shapes";
import { useContextMenu } from "./useContextMenu";
import { useSelection } from "./useSelection";
import { usePanningAndZooming } from "./usePanningAndZooming";

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

  onMounted(() => {
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
        showContextMenu(evt, canvasContainer.value as HTMLElement);
        selectedCell.value = elementView.model;
      });

      paper.on("element:pointerdown", (elementView) => {
        selectCell(elementView.model);
      });

      paper.on("blank:pointerdown", () => {
        deselectCell();
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
    let shape: BaseShape;
    switch (shapeType) {
      case "ShapeA":
        shape = new ShapeA();
        break;
      case "ShapeB":
        shape = new ShapeB();
        break;
      case "ShapeC":
        shape = new ShapeC();
        break;
      default:
        shape = new BaseShape();
    }
    shape.position(150, 150); // Position the shape at the center
    shape.attr("body/strokeDasharray", ""); // Set default border style to solid
    graph.addCell(shape);
  };

  const duplicateCell = () => {
    if (selectedCell.value) {
      const clone = selectedCell.value.clone();
      clone.position(
        selectedCell.value.position().x,
        selectedCell.value.position().y
      ); // Copy position
      clone.attr("body/strokeDasharray", ""); // Reset border to solid
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

  return {
    contextMenuVisible,
    contextMenuPosition,
    addShapeToCanvas,
    duplicateCell,
    deleteCell,
    hideContextMenu,
    selectedCellProperties,
  };
}
