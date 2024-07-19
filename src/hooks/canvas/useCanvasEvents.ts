import * as joint from "jointjs";
import { Ref } from "vue";

export function useCanvasEvents(
  paper: joint.dia.Paper,
  canvasContainer: HTMLElement,
  linkSource: Ref<joint.dia.Element | null>,
  selectCell: (cell: joint.dia.Element) => void,
  deselectCell: () => void,
  showContextMenu: (evt: MouseEvent, container: HTMLElement) => void,
  hideContextMenu: () => void,
  contextMenuVisible: Ref<boolean>,
  graph: Ref<joint.dia.Graph | null>
) {
  paper.on("element:contextmenu", (elementView, evt) => {
    evt.preventDefault();
    selectCell(elementView.model);
    showContextMenu(evt, canvasContainer);
  });

  paper.on("element:pointerdown", (elementView, evt) => {
    if (evt.ctrlKey) {
      if (linkSource.value) {
        if (linkSource.value.id !== elementView.model.id) {
          const link = new joint.shapes.standard.Link({
            source: { id: linkSource.value.id },
            target: { id: elementView.model.id },
          });
          link.addTo(graph.value!);
        }
        linkSource.value = null;
      } else {
        linkSource.value = elementView.model;
      }
    } else {
      selectCell(elementView.model);
    }
  });

  paper.on("link:contextmenu", (linkView, evt) => {
    evt.preventDefault();
    linkView.model.remove();
  });

  paper.on("blank:pointerdown", () => {
    deselectCell();
    linkSource.value = null;
  });

  document.addEventListener("click", (event) => {
    if (
      contextMenuVisible.value &&
      !(event.target as HTMLElement).closest(".context-menu")
    ) {
      hideContextMenu();
    }
  });
}
