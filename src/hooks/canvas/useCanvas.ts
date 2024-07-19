import { ref, onMounted, Ref } from "vue";
import * as joint from "jointjs";
import { DynamicShape, createShape } from "../../shapes";
import { useContextMenu } from "../useContextMenu";
import { useSelection } from "../useSelection";
import { usePanningAndZooming } from "../usePanningAndZooming";
import { fetchAlgorithms, sendAlgorithmData } from "../../services/api";
import { useCanvasEvents } from "./useCanvasEvents";
import { useGraphOperations } from "./useGraphOperations";

export function useCanvas(
  canvasContainer: Ref<HTMLDivElement | null>,
  canvas: Ref<HTMLDivElement | null>
) {
  const paper = ref<joint.dia.Paper | null>(null);
  const graph = ref<joint.dia.Graph | null>(null);
  const linkSource = ref<joint.dia.Element | null>(null);
  const availableShapes = ref<
    Array<{ type: string; create: () => DynamicShape }>
  >([]);

  const {
    contextMenuVisible,
    contextMenuPosition,
    showContextMenu,
    hideContextMenu,
  } = useContextMenu();

  const { selectedCell, selectedCellProperties, selectCell, deselectCell } =
    useSelection();

  onMounted(async () => {
    const algorithms = await fetchAlgorithms();
    availableShapes.value = Object.keys(algorithms).map((type) => ({
      type,
      create: () => createShape(type, algorithms[type], type, "#ff0000", type),
    }));

    if (canvas.value && canvasContainer.value) {
      graph.value = new joint.dia.Graph();
      paper.value = new joint.dia.Paper({
        el: canvas.value,
        model: graph.value,
        width: canvasContainer.value.clientWidth,
        height: canvasContainer.value.clientHeight,
        gridSize: 10,
        drawGrid: true,
        background: {
          color: "rgba(0, 255, 0, 0.3)",
        },
      });

      useCanvasEvents(
        paper.value,
        canvasContainer.value,
        linkSource,
        selectCell,
        deselectCell,
        showContextMenu,
        hideContextMenu,
        contextMenuVisible,
        graph
      );
      const { enableZooming, enablePanning } = usePanningAndZooming(
        canvasContainer.value,
        paper.value
      );
      enableZooming();
      enablePanning();
    }
  });

  const {
    addShapeToCanvas,
    updateSelectedCell,
    duplicateCell,
    deleteCell,
    start,
    resolve,
  } = useGraphOperations(
    graph,
    selectedCell,
    selectedCellProperties,
    linkSource,
    contextMenuVisible,
    availableShapes
  );

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
