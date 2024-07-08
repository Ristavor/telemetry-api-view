/* eslint-disable @typescript-eslint/no-unused-vars */
import type * as joint from "jointjs";

declare module "jointjs" {
  namespace dia {
    interface Paper {
      el: HTMLElement;
    }

    interface ElementView {
      model: joint.dia.Element;
    }
  }
}
