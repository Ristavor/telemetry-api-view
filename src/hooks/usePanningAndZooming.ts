import * as joint from "jointjs";

export function usePanningAndZooming(
  canvasContainer: HTMLElement,
  paper: joint.dia.Paper
) {
  let currentScale = 1;

  const enableZooming = () => {
    canvasContainer.addEventListener("wheel", (event) => {
      event.preventDefault();
      const delta = event.deltaY * -0.005; // Reduced zoom step
      currentScale += delta;
      currentScale = Math.min(Math.max(0.5, currentScale), 2);
      paper.scale(currentScale);
    });
  };

  const enablePanning = () => {
    let isPanning = false;
    let startPoint = { x: 0, y: 0 };

    paper.on("blank:pointerdown", (event) => {
      isPanning = true;
      startPoint = { x: event.clientX, y: event.clientY };
      (paper.el as HTMLElement).style.cursor = "grab";
    });

    paper.el.addEventListener("mousemove", (event) => {
      if (!isPanning) return;
      const dx = event.clientX - startPoint.x;
      const dy = event.clientY - startPoint.y;
      const currentTranslate = paper.translate();
      paper.translate(currentTranslate.tx + dx, currentTranslate.ty + dy);
      startPoint = { x: event.clientX, y: event.clientY };
    });

    paper.el.addEventListener("mouseup", () => {
      isPanning = false;
      (paper.el as HTMLElement).style.cursor = "default";
    });

    paper.el.addEventListener("mouseleave", () => {
      isPanning = false;
      (paper.el as HTMLElement).style.cursor = "default";
    });
  };

  return {
    enableZooming,
    enablePanning,
  };
}
