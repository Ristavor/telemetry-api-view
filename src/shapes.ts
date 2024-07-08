import * as joint from "jointjs";

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
  constructor() {
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
  }
}

export class ShapeA extends BaseShape {
  constructor() {
    super();
    this.attr({
      body: { fill: "#ff0000" }, // Red color in hex format
      label: { text: "ShapeA" },
    });
  }
}

export class ShapeB extends BaseShape {
  constructor() {
    super();
    this.attr({
      body: { fill: "#00ff00" }, // Green color in hex format
      label: { text: "ShapeB" },
    });
  }
}

export class ShapeC extends BaseShape {
  constructor() {
    super();
    this.attr({
      body: { fill: "#0000ff" }, // Blue color in hex format
      label: { text: "ShapeC" },
    });
  }
}
