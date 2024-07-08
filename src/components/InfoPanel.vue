<template>
  <div class="info-panel">
    <p>Info 1: Details</p>
    <p>Info 2: More Details</p>
    <p>Info 3: Even More Details</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "InfoPanel",
});
</script>

<style scoped>
.info-panel {
  height: 50px;
  background-color: #f1f1f1;
  display: flex;
  align-items: center;
  padding: 0 10px;
}
p {
  margin-right: 20px;
}
</style>
