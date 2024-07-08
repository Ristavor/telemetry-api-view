/* eslint-disable @typescript-eslint/no-unused-vars */
import type * as joint from "jointjs";

declare module "jointjs" {
  namespace dia {
    interface Paper {
      el: HTMLElement;
    }
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
