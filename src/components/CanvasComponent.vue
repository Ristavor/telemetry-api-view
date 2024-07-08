<template>
  <div
    ref="canvasContainer"
    class="canvas-container"
    @click="hideContextMenu"
    @contextmenu.prevent
  >
    <div ref="canvas" class="canvas"></div>
    <ContextMenu
      :visible="contextMenuVisible"
      :position="contextMenuPosition"
      @duplicate="duplicateCell"
      @delete="deleteCell"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import ContextMenu from "./ContextMenu.vue";
import { useCanvas } from "../hooks/useCanvas";

export default defineComponent({
  name: "CanvasComponent",
  components: {
    ContextMenu,
  },
  props: {
    shapeToAdd: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { emit }) {
    const canvasContainer = ref<HTMLDivElement | null>(null);
    const canvas = ref<HTMLDivElement | null>(null);

    const {
      contextMenuVisible,
      contextMenuPosition,
      addShapeToCanvas,
      duplicateCell,
      deleteCell,
      hideContextMenu,
      selectedCellProperties,
    } = useCanvas(canvasContainer, canvas);

    watch(
      () => props.shapeToAdd,
      (newShape) => {
        if (newShape) {
          addShapeToCanvas(newShape);
        }
      }
    );

    watch(selectedCellProperties, (newProperties) => {
      emit("update-properties", newProperties);
    });

    return {
      canvasContainer,
      canvas,
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
</style>
