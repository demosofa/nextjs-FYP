import axios, { AxiosStatic, AxiosInstance } from "axios";
import { expireStorage } from ".";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function retryAxios(
  axiosInstance: AxiosStatic | AxiosInstance,
  maxRetry = 2
) {
  let counter = 0;
  axiosInstance.interceptors.response.use(undefined, async (error) => {
    if (
      error.response.status === 401 &&
      error.response.data.message === "Token is expired" &&
      counter <= maxRetry
    ) {
      try {
        const response = await axios.post(`${LocalApi}/auth/refreshToken`);
        const accessToken = response.data;
        expireStorage.setItem("accessToken", accessToken);
        const config = {
          ...error.config,
          headers: {
            ...error.config.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        };
        counter += 1;
        return axiosInstance(config);
      } catch (err) {
        return Promise.reject(err);
      }
    } else if (error.response.status === 401 && !error.response.data.message) {
      localStorage.clear();
      window.location.href = error.response.headers.location;
    } else return Promise.reject(error);
  });
}
