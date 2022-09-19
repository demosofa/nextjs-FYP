import { AxiosStatic, AxiosInstance } from "axios";

const LocalApi = process.env.NEXT_PUBLIC_API;

export default function retryAxios(axiosInstance: AxiosStatic | AxiosInstance) {
  axiosInstance.interceptors.response.use(undefined, async (error) => {
    if (
      error.response.status === 401 &&
      error.response.data.message === "Token is expired"
    ) {
      try {
        await axiosInstance.post(`${LocalApi}/auth/refreshToken`);
        return axiosInstance(error.config);
      } catch (err) {
        return Promise.reject(err);
      }
    } else if (error.response.status === 401 && !error.response.data.message) {
      localStorage.clear();
      window.location = error.response.headers.location;
    } else return Promise.reject(error);
  });
}
