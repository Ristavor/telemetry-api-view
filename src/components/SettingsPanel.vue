<template>
  <div class="settings-panel">
    <div v-if="properties">
      <h3>Selected Block Properties</h3>
      <p>
        <strong>Name:</strong>
        <input type="text" v-model="updatedName" disabled />
      </p>
      <div v-for="(value, key) in updatedParams" :key="key">
        <strong>{{ key }}:</strong>
        <input type="text" v-model="updatedParams[key]" />
      </div>
      <p>
        <strong>Color:</strong>
        <input type="color" v-model="updatedColor" />
      </p>
      <p>
        <strong>Data:</strong>
        <input type="text" v-model="updatedData" disabled />
      </p>
      <button @click="updateBlock">Update</button>
      <button @click="start">Start</button>
    </div>
    <div v-else>
      <p>Please select a block to view its properties.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect } from "vue";
import { BlockParams } from "../shapes";

export default defineComponent({
  name: "SettingsPanel",
  props: {
    properties: {
      type: Object as PropType<{
        name: string;
        color: string;
        params: BlockParams;
        data: string;
      } | null>,
      default: null,
    },
  },
  emits: ["update-block", "start"],
  setup(props, { emit }) {
    const updatedName = ref("");
    const updatedParams = ref<BlockParams>({});
    const updatedColor = ref("#000000");
    const updatedData = ref("");

    watchEffect(() => {
      if (props.properties) {
        updatedName.value = props.properties.name;
        updatedParams.value = { ...props.properties.params };
        updatedColor.value = props.properties.color;
        updatedData.value = props.properties.data;
      } else {
        updatedName.value = "";
        updatedParams.value = {};
        updatedColor.value = "#000000";
        updatedData.value = "";
      }
    });

    const updateBlock = () => {
      emit("update-block", {
        name: updatedName.value,
        color: updatedColor.value,
        params: updatedParams.value,
      });
    };

    const start = () => {
      emit("start");
    };

    return {
      updatedName,
      updatedParams,
      updatedColor,
      updatedData,
      updateBlock,
      start,
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
