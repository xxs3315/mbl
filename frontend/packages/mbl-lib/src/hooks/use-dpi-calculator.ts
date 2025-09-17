import { useMount } from "react-use";
import { useDpi } from "../providers/dpi-provider";

export function useDpiCalculator() {
  const { setDpi } = useDpi();

  const getDPI = () => {
    const dpiDiv = document.createElement("div");
    dpiDiv.style.cssText =
      "width:1in;height:1in;position:absolute;left:-100%;top:-100%;";
    document.body.appendChild(dpiDiv);
    const dpi = dpiDiv.offsetWidth;
    document.body.removeChild(dpiDiv);
    return dpi;
  };

  useMount(() => {
    setDpi(getDPI());
  });

  return {
    getDPI,
  };
}
