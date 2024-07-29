import { useState } from "react";

export default function useCollapse() {
  const [isTimelineVisibility, setTimelineVisiblity] = useState<boolean>(false);
  const [isColorSwatchVisibility, setColorSwatchVisiblity] =
    useState<boolean>(false);

  return {
    isColorSwatchVisibility,
    setColorSwatchVisiblity,
    isTimelineVisibility,
    setTimelineVisiblity,
  };
}
