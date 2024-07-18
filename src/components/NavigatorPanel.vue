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
import { fetchAlgorithms } from "../services/api";

export default defineComponent({
  name: "NavigatorPanel",
  emits: ["add-shape"],
  setup(_, { emit }) {
    const blocks = ref([]);

    onMounted(async () => {
      const algorithms = await fetchAlgorithms();
      blocks.value = Object.keys(algorithms).map((type) => ({
        type,
        params: algorithms[type],
      }));
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
