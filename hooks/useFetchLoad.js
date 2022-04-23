import { useState, useEffect, useMemo, useRef } from "react";

export default function useFetchLoad(
  { baseURL, params, ...config },
  callback,
  dependencies
) {
  const controller = useRef();
  const query = useMemo(() => {
    return Object.entries(params).reduce(
      (prev, current) => `${prev}&${current[0]}=${current[1]}`,
      "?"
    );
  }, dependencies);
  const request = useMemo(
    () => new Request(`${baseURL + query}`, config),
    dependencies
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleFetch = async () => {
      controller.current = new AbortController();
      try {
        setLoading(true);
        const data = await (
          await fetch(request, { signal: controller.current.signal })
        ).json();
        await callback(data);
        setLoading(false);
      } catch (error) {
        throw new Error(error);
      }
    };
    handleFetch();
    return () => controller.current.abort();
  }, dependencies);
  return [loading, request, setLoading];
}
