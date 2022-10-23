import { AxiosInstance, AxiosRequestConfig } from "axios";
import { useState, DependencyList } from "react";
import decoder from "jwt-decode";
import { useAxiosLoad } from ".";
import { expireStorage, retryAxios } from "../utils";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function useAuthLoad({
  config,
  cb,
  roles,
  deps = [],
}: {
  config?: AxiosRequestConfig;
  cb?: (AxiosInstance: AxiosInstance) => unknown;
  roles: string[];
  deps?: DependencyList;
}) {
  const [isLoggined, setLoggined] = useState(false);
  const [isAuthorized, setAuthorized] = useState(false);
  const [error, setError] = useState();
  const { loading, setLoading, axiosInstance } = useAxiosLoad({
    config,
    deps,
    callback: async (axiosInstance) => {
      let accessToken = expireStorage.getItem("accessToken");
      if (!accessToken) {
        setLoading(false);
        setLoggined(false);
        setAuthorized(false);
        return;
      } else setLoggined(true);

      try {
        const { role } = decoder(accessToken) as { role: string };
        if (!roles.includes(role)) {
          setLoading(false);
          setAuthorized(false);
          return;
        } else setAuthorized(true);
      } catch (error) {
        await axiosInstance
          .post(`${LocalApi}/auth/refreshToken`, null)
          .then((res) => {
            accessToken = res.data;
            expireStorage.setItem("accessToken", accessToken);
            setAuthorized(true);
          })
          .catch((res) => setError(res));
      }

      if (cb) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        retryAxios(axiosInstance);
        await cb(axiosInstance);
      }
      return;
    },
  });
  return { loading, isLoggined, isAuthorized, error, axiosInstance };
}
