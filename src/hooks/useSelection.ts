import { ref } from "vue";
import * as joint from "jointjs";

export function useSelection() {
  const selectedCell = ref<joint.dia.Element | null>(null);
  const selectedCellProperties = ref<{ name: string; color: string } | null>(
    null
  );

  const selectCell = (cell: joint.dia.Element) => {
    if (selectedCell.value) {
      selectedCell.value.attr("body/strokeDasharray", ""); // Reset previous selected cell border to solid
    }
    selectedCell.value = cell;
    const color = cell.attr("body/fill");
    const name = cell.attr("label/text");
    selectedCellProperties.value = { name, color };
    cell.attr("body/strokeDasharray", "5,5"); // Set selected cell border to dashed
  };

  const deselectCell = () => {
    if (selectedCell.value) {
      selectedCell.value.attr("body/strokeDasharray", ""); // Reset border to solid
    }
    selectedCell.value = null;
    selectedCellProperties.value = null;
  };

  return {
    selectedCell,
    selectedCellProperties,
    selectCell,
    deselectCell,
  };
}
