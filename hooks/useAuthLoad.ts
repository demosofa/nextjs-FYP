import { AxiosRequestConfig } from "axios";
import { useState, DependencyList } from "react";
import decoder from "jwt-decode";
import { useAxiosLoad } from ".";
import { expireStorage, retryAxios } from "../utils";

export default function useAuthLoad({
  config,
  roles,
  deps = [],
}: {
  config: AxiosRequestConfig;
  roles: string[];
  deps?: DependencyList;
}) {
  const [isLoggined, setLoggined] = useState(false);
  const [isAuthorized, setAuthorized] = useState(false);
  const [data, setData] = useState(null);
  const { loading, setLoading } = useAxiosLoad({
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

      retryAxios(axiosInstance);
      const response = await axiosInstance({
        ...config,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...config.headers,
        },
      });
      const value = response.data;
      setData(value);
      return;
    },
  });
  return { loading, isLoggined, isAuthorized, data, setData };
}
