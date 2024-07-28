import { useState } from "react";

export default function useCollapse() {
  const [isTimelineVisibility, setTimelineVisiblity] = useState<boolean>(true);
  const [isColorSwatchVisibility, setColorSwatchVisiblity] =
    useState<boolean>(true);

  return {
    isColorSwatchVisibility,
    setColorSwatchVisiblity,
    isTimelineVisibility,
    setTimelineVisiblity,
  };
}
