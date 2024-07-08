<template>
  <div id="app">
    <ActionPanel />
    <div class="main-content">
      <NavigatorPanel @add-shape="shapeToAdd = $event" />
      <CanvasComponent :shapeToAdd="shapeToAdd || ''" />
      <SettingsPanel />
    </div>
    <InfoPanel />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
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
  data() {
    return {
      shapeToAdd: null,
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
