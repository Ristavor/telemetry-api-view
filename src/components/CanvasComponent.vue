<template>
  <div
    ref="canvasContainer"
    class="canvas-container"
    @click="hideContextMenu"
    @contextmenu.prevent
  >
    <div ref="canvas" class="canvas"></div>
    <div
      v-if="contextMenuVisible"
      :style="{
        top: `${contextMenuPosition.y}px`,
        left: `${contextMenuPosition.x}px`,
      }"
      class="context-menu"
    >
      <ul>
        <li @click="duplicateCell">Duplicate</li>
        <li @click="deleteCell">Delete</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import * as joint from "jointjs";
import { BaseShape, ShapeA, ShapeB, ShapeC } from "../shapes";

export default defineComponent({
  name: "CanvasComponent",
  props: {
    shapeToAdd: {
      type: String,
      default: null,
    },
  },
  watch: {
    shapeToAdd(newShape) {
      if (newShape) {
        this.addShapeToCanvas(newShape);
      }
    },
  },
  setup() {
    const canvasContainer: Ref<HTMLDivElement | null> = ref(null);
    const canvas: Ref<HTMLDivElement | null> = ref(null);
    let paper: joint.dia.Paper;
    let graph: joint.dia.Graph;

    const contextMenuVisible = ref(false);
    const contextMenuPosition = ref({ x: 0, y: 0 });
    const selectedCell = ref<joint.dia.Element | null>(null);

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
      graph.addCell(shape);
    };

    const duplicateCell = () => {
      if (selectedCell.value) {
        const clone = selectedCell.value.clone();
        clone.position(
          selectedCell.value.position().x,
          selectedCell.value.position().y
        ); // Copy position
        graph.addCell(clone);
        contextMenuVisible.value = false;
      }
    };

    const deleteCell = () => {
      if (selectedCell.value) {
        selectedCell.value.remove();
        contextMenuVisible.value = false;
      }
    };

    const hideContextMenu = () => {
      contextMenuVisible.value = false;
    };

    return {
      canvasContainer,
      canvas,
      addShapeToCanvas,
      contextMenuVisible,
      contextMenuPosition,
      duplicateCell,
      deleteCell,
      hideContextMenu,
    };
  },
});
</script>

<style scoped>
.canvas-container {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}
.canvas {
  width: 100%;
  height: 100%;
}
.context-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}
.context-menu ul {
  list-style: none;
  margin: 0;
  padding: 5px 0;
}
.context-menu li {
  padding: 8px 12px;
  cursor: pointer;
}
.context-menu li:hover {
  background-color: #f0f0f0;
}
</style>
