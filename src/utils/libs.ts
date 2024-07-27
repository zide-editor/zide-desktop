  export const compouteCords = (e: MouseEvent) => {
    if (e.clientX && e.clientY) return { x: e.clientX, y: e.clientY };
  };
