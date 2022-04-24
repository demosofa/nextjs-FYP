import { useState, useEffect, useRef } from "react";
import Devices from "../helpers/Devices";

export default function useMedia(min = 768, max = 1023) {
  const [device, setDevice] = useState(Devices.pc);
  const matchMediaRef = useRef();

  useEffect(() => {
    matchMediaRef.current = window.matchMedia(
      `(min-width:${min}px) and (max-width:${max}px)`
    );

    const handleSetDevice = () => {
      setDevice(() => {
        if (matchMediaRef.current.matches) return Devices.tablet;
        else if (!matchMediaRef.current.matches && window.innerWidth <= min - 1)
          return Devices.phone;
        else if (!matchMediaRef.current.matches && window.innerWidth >= max + 1)
          return Devices.pc;
      });
    };

    matchMediaRef.current.addEventListener("change", handleSetDevice);
    return () => {
      matchMediaRef.current.removeEventListener("change", handleSetDevice);
    };
  }, [min, max]);
  return device;
}
