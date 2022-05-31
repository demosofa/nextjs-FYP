import { useState, useEffect } from "react";
import Devices from "../helpers/Devices";

export default function useMedia(min = 768, max = 1023) {
  const [device, setDevice] = useState();

  useEffect(() => {
    const initialValue = () =>
      (window.innerWidth >= max && Devices.pc) ||
      (window.innerWidth >= min && Devices.tablet) ||
      Devices.phone;
    setDevice(() => {
      return initialValue();
    });
  }, [min, max]);

  useEffect(() => {
    const checkMedia = window.matchMedia(
      `(min-width:${min}px) and (max-width:${max}px)`
    );

    const handleSetDevice = (e) => {
      if (e.matches) setDevice(Devices.tablet);
      else if (!e.matches && window.innerWidth <= min - 1)
        setDevice(Devices.phone);
      else if (!e.matches && window.innerWidth >= max + 1)
        setDevice(Devices.pc);
    };

    checkMedia.addEventListener("change", handleSetDevice);
    return () => {
      checkMedia.removeEventListener("change", handleSetDevice);
    };
  }, [min, max]);
  return device;
}
