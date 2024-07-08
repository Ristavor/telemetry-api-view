import { ref, onMounted, Ref } from "vue";
import * as joint from "jointjs";
import { BaseShape, ShapeA, ShapeB, ShapeC } from "../shapes";

export function useCanvas(
  canvasContainer: Ref<HTMLDivElement | null>,
  canvas: Ref<HTMLDivElement | null>
) {
  let paper: joint.dia.Paper;
  let graph: joint.dia.Graph;

  const contextMenuVisible = ref(false);
  const contextMenuPosition = ref({ x: 0, y: 0 });
  const selectedCell = ref<joint.dia.Element | null>(null);
  const selectedCellProperties = ref<{ name: string; color: string } | null>(
    null
  );

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
        evt.preventDefault();
        const { clientX: x, clientY: y } = evt;
        const rect = canvasContainer.value?.getBoundingClientRect();
        if (rect) {
          contextMenuPosition.value = { x: x - rect.left, y: y - rect.top };
        }
        contextMenuVisible.value = true;
        selectedCell.value = elementView.model;
      });

      paper.on("element:pointerdown", (elementView) => {
        selectCell(elementView.model);
      });

      paper.on("blank:pointerdown", () => {
        deselectCell();
      });

      // Enable zooming with mouse wheel
      let currentScale = 1;

      canvasContainer.value.addEventListener("wheel", (event) => {
        event.preventDefault();
        const delta = event.deltaY * -0.005; // Reduced zoom step
        currentScale += delta;
        currentScale = Math.min(Math.max(0.5, currentScale), 2);
        paper.scale(currentScale);
      });

      // Enable panning with left mouse button
      let isPanning = false;
      let startPoint = { x: 0, y: 0 };

      paper.on("blank:pointerdown", (event) => {
        isPanning = true;
        startPoint = { x: event.clientX, y: event.clientY };
        (paper.el as HTMLElement).style.cursor = "grab";
      });

      paper.el.addEventListener("mousemove", (event) => {
        if (!isPanning) return;
        const dx = event.clientX - startPoint.x;
        const dy = event.clientY - startPoint.y;
        const currentTranslate = paper.translate();
        paper.translate(currentTranslate.tx + dx, currentTranslate.ty + dy);
        startPoint = { x: event.clientX, y: event.clientY };
      });

      paper.el.addEventListener("mouseup", () => {
        isPanning = false;
        (paper.el as HTMLElement).style.cursor = "default";
      });

      paper.el.addEventListener("mouseleave", () => {
        isPanning = false;
        (paper.el as HTMLElement).style.cursor = "default";
      });

      document.addEventListener("click", (event) => {
        if (
          contextMenuVisible.value &&
          !(event.target as HTMLElement).closest(".context-menu")
        ) {
          contextMenuVisible.value = false;
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

  const selectCell = (cell: joint.dia.Element) => {
    if (selectedCell.value) {
      selectedCell.value.attr("body/strokeDasharray", ""); // Reset previous selected cell border to solid
    }
    selectedCell.value = cell;
    const color = cell.attr("body/fill");
    const name = cell.attr("label/text");
    selectedCellProperties.value = { name, color };
    cell.attr("body/strokeDasharray", "5,5"); // Set selected cell border to dashed
  };

  const deselectCell = () => {
    if (selectedCell.value) {
      selectedCell.value.attr("body/strokeDasharray", ""); // Reset border to solid
    }
    selectedCell.value = null;
    selectedCellProperties.value = null;
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

  const hideContextMenu = () => {
    contextMenuVisible.value = false;
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
