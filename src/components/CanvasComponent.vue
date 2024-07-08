<template>
  <div ref="canvasContainer" class="canvas-container">
    <div ref="canvas" class="canvas"></div>
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
          paper.el.style.cursor = "grab"; // `el` is now recognized
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
          paper.el.style.cursor = "default";
        });

        paper.el.addEventListener("mouseleave", () => {
          isPanning = false;
          paper.el.style.cursor = "default";
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

    return {
      canvasContainer,
      canvas,
      addShapeToCanvas,
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
</style>
