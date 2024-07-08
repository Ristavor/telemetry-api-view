import * as joint from "jointjs";

declare module "jointjs" {
  namespace dia {
    interface Paper {
      el: HTMLElement;
    }
  }
}
