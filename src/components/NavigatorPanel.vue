<template>
  <div class="navigator-panel">
    <h3>Navigator</h3>
    <ul>
      <li
        v-for="block in blocks"
        :key="block.type"
        @dblclick="$emit('add-shape', block.type)"
      >
        {{ block.type }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import mockBlocks from "../mockBlocks.json";

export default defineComponent({
  name: "NavigatorPanel",
  emits: ["add-shape"],
  setup() {
    const blocks = ref(mockBlocks);

    onMounted(() => {
      // You can add additional logic here if needed
    });

    return {
      blocks,
    };
  },
});
</script>

<style scoped>
.navigator-panel {
  width: 200px;
  background-color: #f0f0f0;
  padding: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 5px;
  cursor: pointer;
}

li:hover {
  background-color: #e0e0e0;
}
</style>
