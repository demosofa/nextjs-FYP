import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { expireStorage } from "../utils";
import parser from "jwt-decode";
import { Realtime } from "ably/promises";
import { useDispatch } from "react-redux";
import { addNotification } from "../redux/reducer/notificationSlice";

const LocalApi = process.env.NEXT_PUBLIC_API;
const AblyFe = createContext();

export default function AblyContext({ children }) {
  const ably = useRef();
  const { role, username } = useMemo(() => {
    if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
      let decoded = parser(expireStorage.getItem("accessToken"));
      if (!ably.current)
        ably.current = new Realtime.Promise({
          authUrl: `${LocalApi}/createAblyToken`,
        });
      return decoded;
    }
    return { username: "", role: "" };
  }, []);

  const dispatch = useDispatch();
  useEffect(() => {
    if (ably.current && username) {
      ably.current.channels.get(username).subscribe(({ name, data }) => {
        switch (name) {
          case "shipping":
            dispatch(addNotification({ ...data }));
            break;
          case "comment":
            dispatch(addNotification({ ...data }));
            break;
        }
      });
    }
  }, [ably.current, username]);
  return (
    <AblyFe.Provider value={{ ably: ably.current }}>{children}</AblyFe.Provider>
  );
}

export function useAblyContext() {
  return useContext(AblyFe);
}
