import { useCallback, useRef } from "react";

export default function useAbortController() {
  const controller = useRef<AbortController>();
  const wrapper = useCallback(
    async (callback: (abortController: AbortController) => Promise<any>) => {
      if (!controller.current) controller.current = new AbortController();
      else controller.current.abort();
      let res = null;
      if (!controller.current.signal.aborted) {
        res = await callback(controller.current);
      }
      controller.current = null;
      return res;
    },
    [controller.current]
  );
  return { wrapper, controller: controller.current };
}
