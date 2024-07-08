<template>
  <div class="settings-panel">
    <label> <input type="checkbox" /> Setting 1 </label>
    <label> <input type="checkbox" /> Setting 2 </label>
    <label> <input type="checkbox" /> Setting 3 </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SettingsPanel",
});
</script>

<style scoped>
.settings-panel {
  width: 200px;
  background-color: #e1e1e1;
  padding: 10px;
}
label {
  display: block;
  margin-bottom: 10px;
}
</style>
