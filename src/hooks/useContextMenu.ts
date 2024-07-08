import { ref } from "vue";

export function useContextMenu() {
  const contextMenuVisible = ref(false);
  const contextMenuPosition = ref({ x: 0, y: 0 });

  const showContextMenu = (event: MouseEvent, container: HTMLElement) => {
    event.preventDefault();
    const { clientX: x, clientY: y } = event;
    const rect = container.getBoundingClientRect();
    contextMenuPosition.value = { x: x - rect.left, y: y - rect.top };
    contextMenuVisible.value = true;
  };

  const hideContextMenu = () => {
    contextMenuVisible.value = false;
  };

  return {
    contextMenuVisible,
    contextMenuPosition,
    showContextMenu,
    hideContextMenu,
  };
}
