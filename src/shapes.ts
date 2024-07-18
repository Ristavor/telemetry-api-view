import * as joint from "jointjs";

export interface BlockParams {
  [key: string]: any;
}

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

export class BaseShape extends joint.dia.Element {
  constructor(params: BlockParams = {}) {
    super({
      type: "baseShape",
      size: { width: 100, height: 40 },
      attrs: {
        body: {
          width: 100,
          height: 40,
          fill: "#ffffff", // Default white color in hex format
          stroke: "#000000",
          strokeWidth: 2,
          strokeDasharray: "",
        },
        label: {
          text: "BaseShape",
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
  }

  generateData(params: BlockParams, inputData: string): string {
    return `${Object.values(params).join(" ")} ${inputData}`;
  }

  processInputData() {
    const params = this.get("params");
    const inputData = this.get("inputData");
    this.set("data", this.generateData(params, inputData));
  }

  receiveData(data: string) {
    this.set("inputData", data);
  }
}

export class ShapeA extends BaseShape {
  constructor() {
    const params = {
      parameter1: "Value 1A",
      parameter2: "Value 2A",
    };
    super(params);
    this.attr({
      body: { fill: "#ff0000" }, // Red color in hex format
      label: { text: "ShapeA" },
    });
  }
}

export class ShapeB extends BaseShape {
  constructor() {
    const params = {
      parameter1: "Value 1B",
      parameter2: "Value 2B",
    };
    super(params);
    this.attr({
      body: { fill: "#00ff00" }, // Green color in hex format
      label: { text: "ShapeB" },
    });
  }
}

export class ShapeC extends BaseShape {
  constructor() {
    const params = {
      parameter1: "Value 1C",
      parameter2: "Value 2C",
    };
    super(params);
    this.attr({
      body: { fill: "#0000ff" }, // Blue color in hex format
      label: { text: "ShapeC" },
    });
  }
}
