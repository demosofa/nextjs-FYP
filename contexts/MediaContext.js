import { createContext, useContext } from "react";
import { useMedia } from "../hooks";
import { Devices } from "../shared";

const Media = createContext();

export default function MediaContext({ children }) {
  const device = useMedia();
  return (
    <Media.Provider value={{ device, Devices }}>{children}</Media.Provider>
  );
}

export function useMediaContext() {
  return useContext(Media);
}
