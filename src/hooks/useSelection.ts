import { ref } from "vue";
import * as joint from "jointjs";
import { BlockParams } from "../shapes";

export function useSelection() {
  const selectedCell = ref<joint.dia.Element | null>(null);
  const selectedCellProperties = ref<{
    name: string;
    color: string;
    params: BlockParams;
    data: string;
  } | null>(null);

  const rgbToHex = (rgb: string) => {
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
    return result
      ? `#${((1 << 24) + (+result[1] << 16) + (+result[2] << 8) + +result[3])
          .toString(16)
          .slice(1)}`
      : rgb;
  };

  const selectCell = (cell: joint.dia.Element) => {
    if (selectedCell.value) {
      selectedCell.value.attr("body/strokeDasharray", ""); // Reset previous selected cell border to solid
    }
    selectedCell.value = cell;
    const color = rgbToHex(cell.attr("body/fill"));
    const name = cell.attr("label/text");
    const params = cell.get("params");
    const data = cell.get("data");
    selectedCellProperties.value = { name, color, params, data };
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
