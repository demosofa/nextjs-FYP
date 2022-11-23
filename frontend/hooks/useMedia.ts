import { useState, useEffect, useMemo, useCallback } from "react";

type QueryObj = {
  min: string;
  max: string;
  screen?: boolean;
};

export default function useMedia(screens: { [screen: string]: QueryObj }) {
  const [device, setDevice] = useState<string>();

  const Devices = useMemo(() => {
    let objDevices: { [key: string]: string } = {};
    Object.keys(screens).forEach((key) => {
      objDevices[key] = key;
    });
    return objDevices;
  }, [screens]);

  const stringQuery = (queryObj: QueryObj): string => {
    return Object.entries(queryObj).reduce((prev, curr, i, array) => {
      if (i > 0 && i < array.length) prev += " and ";
      switch (curr[0]) {
        case "min":
          prev += `(min-width: ${curr[1]})`;
          break;
        case "max":
          prev += `(max-width: ${curr[1]})`;
          break;
        case "screen":
          if (curr[1]) prev += `screen`;
          break;
      }
      return prev;
    }, "");
  };

  const arrMedia = useMemo(
    () =>
      typeof window !== "undefined"
        ? Object.values(screens).map((query) =>
            window.matchMedia(stringQuery(query))
          )
        : [],
    [screens]
  );

  const handleSetDevice = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setDevice(
          Object.keys(Devices).find(
            (key) => stringQuery(screens[key]) === e.media
          )
        );
      }
    },
    [Devices]
  );

  useEffect(() => {
    arrMedia.forEach(handleSetDevice);
  }, [arrMedia]);

  useEffect(() => {
    arrMedia.forEach((media) => {
      media.addEventListener("change", handleSetDevice);
    });

    return () => {
      arrMedia.forEach((media) => {
        media.addEventListener("change", handleSetDevice);
      });
    };
  }, [arrMedia]);

  return [device, Devices];
}
