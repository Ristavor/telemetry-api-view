<template>
  <div class="settings-panel">
    <div v-if="properties">
      <h3>Selected Block Properties</h3>
      <p>
        <strong>Name:</strong>
        <input type="text" v-model="updatedName" />
      </p>
      <p>
        <strong>Color:</strong>
        <input type="color" v-model="updatedColor" />
      </p>
      <button @click="updateBlock">Update</button>
    </div>
    <div v-else>
      <p>Please select a block to view its properties.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect } from "vue";

export default defineComponent({
  name: "SettingsPanel",
  props: {
    properties: {
      type: Object as PropType<{ name: string; color: string } | null>,
      default: null,
    },
  },
  emits: ["update-block"],
  setup(props, { emit }) {
    const updatedName = ref("");
    const updatedColor = ref("#000000");

    watchEffect(() => {
      if (props.properties) {
        updatedName.value = props.properties.name;
        updatedColor.value = props.properties.color;
      }
    });

    const updateBlock = () => {
      emit("update-block", {
        name: updatedName.value,
        color: updatedColor.value,
      });
    };

    return {
      updatedName,
      updatedColor,
      updateBlock,
    };
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
