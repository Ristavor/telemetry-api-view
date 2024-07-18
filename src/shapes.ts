import * as joint from "jointjs";
import { dataProcessors } from "./dataProcessors";
import { BlockParams } from "./types";

const baseMarkup = [
  {
    tagName: "rect",
    selector: "body",
  },
  {
    tagName: "text",
    selector: "label",
  },
];

export class DynamicShape extends joint.dia.Element {
  constructor(
    params: BlockParams = {},
    processorName = "",
    color = "#ffffff",
    label = "DynamicShape"
  ) {
    super({
      type: "dynamicShape",
      size: { width: 100, height: 40 },
      attrs: {
        body: {
          width: 100,
          height: 40,
          fill: color, // Default color in hex format
          stroke: "#000000",
          strokeWidth: 2,
          strokeDasharray: "",
        },
        label: {
          text: label,
          fill: "#000000",
          fontSize: 14,
          textAnchor: "middle",
          yAlignment: "middle",
          refX: "50%",
          refY: "50%",
          ref: "body",
          "font-family": "Arial, sans-serif",
        },
      },
      markup: baseMarkup,
    });
    this.set("params", params);
    this.set("inputData", "");
    this.set("data", "");
    this.set("dataProcessor", processorName);
  }

  processInputData() {
    const params = this.get("params");
    const inputData = this.get("inputData");
    const processorName = this.get("dataProcessor");
    const processor = dataProcessors[processorName];
    if (processor) {
      this.set("data", processor(params, inputData));
    }
  }

  receiveData(data: string) {
    this.set("inputData", data);
  }
}

export const createShape = (
  type: string,
  params: BlockParams,
  processorName: string,
  color: string,
  label: string
): DynamicShape => {
  return new DynamicShape(params, processorName, color, label);
};
