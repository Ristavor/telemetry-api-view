<template>
  <div class="navigator">
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NavigatorPanel",
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
}
</style>
