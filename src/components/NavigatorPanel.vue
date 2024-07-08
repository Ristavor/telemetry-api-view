<template>
  <div class="navigator">
    <ul>
      <li @dblclick="addShape('ShapeA')">Shape A</li>
      <li @dblclick="addShape('ShapeB')">Shape B</li>
      <li @dblclick="addShape('ShapeC')">Shape C</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NavigatorPanel",
  emits: ["add-shape"],
  setup(_, { emit }) {
    const addShape = (shapeType: string) => {
      emit("add-shape", shapeType);
    };

    return {
      addShape,
    };
  },
});
</script>

<style scoped>
.navigator {
  width: 200px;
  background-color: #e1e1e1;
  padding: 10px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
  cursor: pointer;
}
li:hover {
  background-color: #ccc;
}
</style>
