<template>
  <div class="action-panel">
    <button>Action 1</button>
    <button>Action 2</button>
    <button>Action 3</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ActionPanel",
});
</script>

<style scoped>
.action-panel {
  height: 50px;
  background-color: #f1f1f1;
  display: flex;
  align-items: center;
  padding: 0 10px;
}
button {
  margin-right: 10px;
}
</style>
