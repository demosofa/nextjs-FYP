import { Realtime } from "ably/promises";
import parser from "jwt-decode";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { showModal } from "../redux/reducer/modalSlice";
import { addNotification } from "../redux/reducer/notificationSlice";
import { expireStorage } from "../utils";

const LocalApi = process.env.NEXT_PUBLIC_API;
const ably = new Realtime.Promise({
  authUrl: `${LocalApi}/createAblyToken`,
});
const AblyFe = createContext(ably);

export default function AblyContext({ children }) {
  const { role, accountId } = useMemo(() => {
    if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
      let decoded = parser(expireStorage.getItem("accessToken"));
      if (decoded) return decoded as { role: string; accountId: string };
    }
    return { accountId: "", role: "" };
  }, []);

  const dispatch = useDispatch();
  useEffect(() => {
    if (accountId) {
      ably.channels.get(accountId).subscribe(({ name, data }) => {
        switch (name) {
          case "shipping":
            dispatch(addNotification({ ...data }));
            break;
          case "comment":
            dispatch(addNotification({ ...data }));
            break;
          case "checkPaid":
            dispatch(showModal(data));
            break;
        }
      });
    }
  }, [ably, accountId]);
  return <AblyFe.Provider value={ably}>{children}</AblyFe.Provider>;
}

export function useAblyContext() {
  return useContext(AblyFe);
}
