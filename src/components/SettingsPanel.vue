<template>
  <div class="settings-panel">
    <div v-if="properties">
      <h3>Selected Block Properties</h3>
      <p><strong>Name:</strong> {{ properties.name }}</p>
      <p><strong>Color:</strong> {{ properties.color }}</p>
    </div>
    <div v-else>
      <p>Please select a block to view its properties.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "SettingsPanel",
  props: {
    properties: {
      type: Object as PropType<{ name: string; color: string } | null>,
      default: null,
    },
  },
});
</script>

<style scoped>
.settings-panel {
  width: 200px;
  background-color: #e1e1e1;
  padding: 10px;
}
</style>
