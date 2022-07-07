import axios, {AxiosStatic} from "axios"
import {expireStorage} from "."

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function retryAxios(axiosInstance: AxiosStatic){
  axiosInstance.interceptors.response.use(undefined, async (error) => {
    if(error.response.status === 401 && error.response.data.message === "Token is expired") {
      try{
        const response = await axios.post(`${LocalApi}/auth/refreshToken`);
        const {accessToken} = await response.data;
        expireStorage.setItem("accessToken", accessToken)
        return new Promise((resolve) => resolve(axiosInstance(error.config)))
      }
      catch(err){
        return Promise.reject(error)
      }
    }
    else if (error.response.status === 401){
      localStorage.clear();
      window.location = error.response.headers.location
    }
    else return Promise.reject(error)
  })
}