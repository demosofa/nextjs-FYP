import { AxiosInstance, CreateAxiosDefaults } from "axios";
import decoder from "jwt-decode";
import { DependencyList, useState } from "react";
import { useAxiosLoad } from ".";
import { expireStorage, retryAxios } from "@utils/index";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function useAuthLoad({
  config,
  cb,
  roles,
  deps = [],
}: {
  config?: CreateAxiosDefaults;
  cb?: (AxiosInstance: AxiosInstance) => unknown;
  roles: string[];
  deps?: DependencyList;
}) {
  const [isLogged, setLogged] = useState(false);
  const [authorized, setAuthorized] = useState(null);
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
        if (Date.now() >= exp * 1000) throw new Error("token was expired");

        if (!role) {
          setLoading(false);
          setLogged(false);
          setAuthorized(null);
          return;
        } else setLogged(true);

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
  return { loading, isLogged, authorized, error, axiosInstance };
}
