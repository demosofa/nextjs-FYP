import { AxiosInstance, AxiosRequestConfig } from "axios";
import { useState, DependencyList } from "react";
import decoder from "jwt-decode";
import { useAxiosLoad } from ".";
import { expireStorage, retryAxios } from "../utils";

export default function useAuthLoad({
  config,
  cb,
  roles,
  deps = [],
}: {
  config?: AxiosRequestConfig;
  cb: (AxiosInstance: AxiosInstance) => unknown;
  roles: string[];
  deps?: DependencyList;
}) {
  const [isLoggined, setLoggined] = useState(false);
  const [isAuthorized, setAuthorized] = useState(false);
  const { loading, setLoading } = useAxiosLoad({
    config,
    deps,
    callback: async (axiosInstance) => {
      const accessToken = expireStorage.getItem("accessToken");
      if (!accessToken) {
        setLoading(false);
        setLoggined(false);
        setAuthorized(false);
        return;
      } else setLoggined(true);

      const { role } = decoder(accessToken) as { exp: number; role: string };
      if (!roles.includes(role)) {
        setLoading(false);
        setAuthorized(false);
        return;
      } else setAuthorized(true);

      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      retryAxios(axiosInstance);
      await cb(axiosInstance);
      return;
    },
  });
  return { loading, isLoggined, isAuthorized };
}
