import { useState, useEffect, useRef, useMemo, DependencyList } from "react";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export default function useAxiosLoad({
  config,
  callback,
  deps = [],
  setError,
}: {
  config?: AxiosRequestConfig;
  callback: (AxiosInstance: AxiosInstance) => unknown;
  deps: DependencyList;
  setError?: Function;
}) {
  const controller = useRef<AbortController>(null);
  const axiosInstance = useMemo(() => axios.create(config), deps);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadingData = async () => {
      controller.current = new AbortController();
      try {
        setLoading(true);
        axiosInstance.defaults.signal = controller.current.signal;
        await callback(axiosInstance);
        setLoading(false);
      } catch (err) {
        setError && setError(err);
      }
    };
    loadingData();
    return () => controller.current?.abort();
  }, deps);

  return { loading, axiosInstance, setLoading, controller };
}
