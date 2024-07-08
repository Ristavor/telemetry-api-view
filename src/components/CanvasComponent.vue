<template>
  <div ref="canvasContainer" class="canvas-container">
    <div ref="canvas" class="canvas"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import * as joint from "jointjs";

export default defineComponent({
  name: "CanvasComponent",
  setup() {
    const canvasContainer = ref<HTMLDivElement | null>(null);
    const canvas = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      if (canvas.value && canvasContainer.value) {
        const graph = new joint.dia.Graph();

        const paper = new joint.dia.Paper({
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

        const rect = new joint.shapes.standard.Rectangle();
        rect.position(100, 100);
        rect.resize(100, 40);
        rect.attr({
          body: {
            fill: "blue",
          },
          label: {
            text: "Hello",
            fill: "white",
          },
        });
        rect.addTo(graph);

        // Enable zooming with mouse wheel
        let currentScale = 1;

        canvasContainer.value.addEventListener("wheel", (event) => {
          event.preventDefault();
          const delta = event.deltaY * -0.001; // Reduced zoom step
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
          paper.el.style.cursor = "grab";
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

    return {
      canvasContainer,
      canvas,
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
