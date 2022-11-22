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
  const [isAuthorized, setAuthorized] = useState(null);
  const [error, setError] = useState();
  const { loading, setLoading, axiosInstance } = useAxiosLoad({
    config,
    deps,
    callback: async (axiosInstance) => {
      let accessToken = expireStorage.getItem("accessToken");
      retryAxios(axiosInstance);
      try {
        const { role, exp } = decoder(accessToken) as {
          role: string;
          exp: number;
        };
        if (Date.now() >= exp * 1000) throw new Error();

        if (!role) {
          setLoading(false);
          setLoggined(false);
          setAuthorized(null);
          return;
        } else setLoggined(true);

        if (!roles.includes(role)) {
          setLoading(false);
          setAuthorized(null);
          return;
        } else setAuthorized(role);
      } catch (error) {
        await axiosInstance
          .post(`${LocalApi}/auth/refreshToken`, null)
          .then((res) => {
            accessToken = res.data;
            expireStorage.setItem("accessToken", accessToken);
            const { role } = decoder(accessToken) as { role: string };
            setAuthorized(role);
          })
          .catch(({ response }) => {
            if (response.status === 401) {
              localStorage.clear();
              window.location = response.data;
            } else setError(response.message);
          });
      }

      if (cb) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        await cb(axiosInstance);
      }
    },
  });
  return { loading, isLoggined, isAuthorized, error, axiosInstance };
}
