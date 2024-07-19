import { Ref } from "vue";
import * as joint from "jointjs";
import { DynamicShape } from "../../shapes";
import { sendAlgorithmData } from "../../services/api";

export function useGraphOperations(
  graph: Ref<joint.dia.Graph | null>,
  selectedCell: Ref<joint.dia.Element | null>,
  selectedCellProperties: Ref<any>,
  linkSource: Ref<joint.dia.Element | null>,
  contextMenuVisible: Ref<boolean>,
  availableShapes: Ref<Array<{ type: string; create: () => DynamicShape }>>
) {
  const addShapeToCanvas = (shapeType: string) => {
    const shapeInfo = availableShapes.value.find(
      (shape) => shape.type === shapeType
    );
    if (!shapeInfo) return;

    const shape = shapeInfo.create();
    shape.position(150, 150); // Position the shape at the center
    shape.attr("body/strokeDasharray", ""); // Set default border style to solid
    graph.value!.addCell(shape);
  };

  const updateSelectedCell = (properties: {
    name: string;
    color: string;
    params: any;
    inputData: string;
  }) => {
    if (selectedCell.value) {
      selectedCell.value.attr("label/text", properties.name);
      selectedCell.value.attr("body/fill", properties.color);
      selectedCell.value.set("params", properties.params);
      selectedCell.value.set("inputData", properties.inputData);
      selectedCellProperties.value = {
        ...properties,
        data: selectedCell.value.get("data"),
      };
    }
  };

  const duplicateCell = () => {
    if (selectedCell.value) {
      const clone = selectedCell.value.clone();
      clone.position(
        selectedCell.value.position().x + 20,
        selectedCell.value.position().y + 20
      ); // Offset the position of the clone
      clone.attr(selectedCell.value.attributes.attrs);
      clone.set("params", { ...selectedCell.value.get("params") });
      clone.set("inputData", selectedCell.value.get("inputData"));
      clone.set("data", selectedCell.value.get("data"));
      clone.attr("body/strokeDasharray", ""); // Reset border style of the clone
      graph.value!.addCell(clone);
      contextMenuVisible.value = false;
    }
  };

  const deleteCell = () => {
    if (selectedCell.value) {
      selectedCell.value.remove();
      contextMenuVisible.value = false;
      linkSource.value = null;
    }
  };

  const start = () => {
    if (selectedCell.value) {
      const cellData = selectedCell.value.get("data");
      const outgoingLinks = graph.value!.getConnectedLinks(selectedCell.value, {
        outbound: true,
      });
      outgoingLinks.forEach((link) => {
        const targetId = link.get("target").id;
        if (targetId) {
          const targetCell = graph.value!.getCell(targetId) as DynamicShape;
          if (targetCell) {
            targetCell.receiveData(cellData);
          }
        }
      });
    }
  };

  const resolve = async () => {
    if (selectedCell.value) {
      const algorithmName = selectedCell.value.attr("label/text");
      const params = selectedCell.value.get("params");
      const inputData = selectedCell.value.get("inputData");
      const response = await sendAlgorithmData(
        algorithmName,
        params,
        inputData
      );
      selectedCell.value.set("data", response);
      selectedCellProperties.value = {
        ...selectedCellProperties.value!,
        data: response,
      };
    }
  };

  return {
    addShapeToCanvas,
    updateSelectedCell,
    duplicateCell,
    deleteCell,
    start,
    resolve,
  };
}
