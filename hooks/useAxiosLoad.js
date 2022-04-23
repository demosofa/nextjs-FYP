import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";

export default function useAxiosLoad(
  config,
  callback,
  dependencies = [],
  setError = null
) {
  const controller = useRef();
  const axiosInstance = useMemo(() => axios.create(config), dependencies);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadingData = async () => {
      controller.current = new AbortController();
      try {
        setLoading(true);
        const newData = await axiosInstance({
          params: {
            ...config.params,
            signal: controller.current.signal,
          },
        }).then((res) => res.data);
        await callback(newData);
        setLoading(false);
      } catch (err) {
        if (setError instanceof Function) setError(err);
      }
    };
    loadingData();
    return () => controller.current.abort();
  }, dependencies);

  return [loading, setLoading, axiosInstance, controller.current];
}
