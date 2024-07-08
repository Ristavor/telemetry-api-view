<template>
  <div id="app">
    <ActionPanel />
    <div class="main-content">
      <NavigatorPanel @add-shape="shapeToAdd = $event" />
      <CanvasComponent
        :shapeToAdd="shapeToAdd || undefined"
        @update-properties="updateProperties"
        ref="canvasComponent"
      />
      <SettingsPanel
        :properties="selectedProperties"
        @update-block="updateBlock"
      />
    </div>
    <InfoPanel />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ActionPanel from "./components/ActionPanel.vue";
import InfoPanel from "./components/InfoPanel.vue";
import NavigatorPanel from "./components/NavigatorPanel.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
import CanvasComponent from "./components/CanvasComponent.vue";

export default defineComponent({
  name: "App",
  components: {
    ActionPanel,
    InfoPanel,
    NavigatorPanel,
    SettingsPanel,
    CanvasComponent,
  },
  setup() {
    const shapeToAdd = ref<string | null>(null);
    const selectedProperties = ref<{ name: string; color: string } | null>(
      null
    );
    const canvasComponent = ref(null);

    const updateProperties = (
      properties: { name: string; color: string } | null
    ) => {
      selectedProperties.value = properties;
    };

    const updateBlock = (properties: { name: string; color: string }) => {
      (canvasComponent.value as any).updateSelectedCell(properties);
    };

    return {
      shapeToAdd,
      selectedProperties,
      updateProperties,
      updateBlock,
      canvasComponent,
    };
  },
});
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  display: flex;
  flex-grow: 1;
}

.main-content > * {
  border-right: 1px solid #ddd;
}

.main-content > *:last-child {
  border-right: none;
}
</style>
