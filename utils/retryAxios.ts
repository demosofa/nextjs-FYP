import axios, {AxiosStatic} from "axios"
import {expireStorage} from "."

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API;

export default function retryAxios(axiosInstance: AxiosStatic, maxRetry = 2){
  let counter = 0
  axiosInstance.interceptors.response.use(undefined, async (error) => {
    if(error.response.status === 401 && error.response.data.message === "Token is expired" && counter <= maxRetry) {
      try{
        const response = await axios.post(`${LocalApi}/auth/refreshToken`);
        const {accessToken} = await response.data;
        expireStorage.setItem("accessToken", accessToken)
        const config = {...error.config, headers: {...error.config.headers, Authorization: `Bearer ${accessToken}`}}
        counter+=1
        return new Promise((resolve) => resolve(axiosInstance(config)))
      }
      catch(err){
        return Promise.reject(err)
      }
    }
    else if (error.response.status === 401 && !error.response.data.message){
      localStorage.clear();
      window.location = error.response.headers.location
    }
    else return Promise.reject(error)
  })
}