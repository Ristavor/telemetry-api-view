<template>
  <div
    v-if="visible"
    :style="{ top: `${position.y}px`, left: `${position.x}px` }"
    class="context-menu"
  >
    <ul>
      <li @click="$emit('duplicate')">Duplicate</li>
      <li @click="$emit('delete')">Delete</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "ContextMenu",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    position: {
      type: Object as PropType<{ x: number; y: number }>,
      required: true,
    },
  },
});
</script>

<style scoped>
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
