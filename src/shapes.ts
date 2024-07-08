import * as joint from "jointjs";

export class BaseShape extends joint.shapes.standard.Rectangle {
  constructor() {
    super();
    this.resize(100, 40);
    this.attr({
      body: {
        fill: "gray",
      },
      label: {
        text: "Base Shape",
        fill: "white",
      },
    });
  }
}

export class ShapeA extends BaseShape {
  constructor() {
    super();
    this.attr({
      body: {
        fill: "blue",
      },
      label: {
        text: "Shape A",
      },
    });
  }
}

export class ShapeB extends BaseShape {
  constructor() {
    super();
    this.attr({
      body: {
        fill: "green",
      },
      label: {
        text: "Shape B",
      },
    });
  }
}

export class ShapeC extends BaseShape {
  constructor() {
    super();
    this.attr({
      body: {
        fill: "red",
      },
      label: {
        text: "Shape C",
      },
    });
  }
}
