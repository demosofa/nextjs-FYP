import { AxiosInstance, AxiosStatic } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import setCookieToken from "./setCookieToken";

export default function retryAxiosBackend(
  axiosInstance: AxiosInstance | AxiosStatic,
  req: NextApiRequest,
  res: NextApiResponse
) {
  axiosInstance.interceptors.response.use(undefined, async (error) => {
    if (
      error.response.status === 401 &&
      error.response.data.message === "Token is expired"
    ) {
      try {
        let config = error.config;
        setCookieToken(req, res);
        config = {
          ...config,
          headers: {
            ...error.config.headers,
            Cookie: res.getHeader("Set-Cookie"),
          },
        };
        return axiosInstance(config);
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      Promise.reject(error.message);
    }
  });
}
