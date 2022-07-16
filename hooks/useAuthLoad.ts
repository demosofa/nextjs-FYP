import {AxiosRequestConfig} from "axios"
import { useState, DependencyList } from "react"
import decoder from "jwt-decode"
import {useAxiosLoad} from ".";
import { retryAxios } from "../utils";

export default function useAuthLoad({config, roles, deps=[]}: {config: AxiosRequestConfig, roles: string[], deps?: DependencyList}){
  const [isLoggined, setLoggined] = useState(false);
  const [isAuthorized, setAuthorized] = useState(false);
  const [data, setData] = useState(null)
  const {loading} = useAxiosLoad({
    deps, callback: async (axiosInstance) => {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));
      if(!accessToken) {setLoggined(false); setAuthorized(false); return}
      const {exp, role} = decoder(accessToken) as {exp: number, role: string};
      if(exp >= Date.now()) {setLoggined(false); return}
      else setLoggined(true);
      if(!roles.includes(role)) {setAuthorized(false); return}
      else setAuthorized(true);
      retryAxios(axiosInstance);
      const value = (await axiosInstance({...config, headers: {
        Authorization: `Bearer ${accessToken}`,
        ...config.headers
      }})).data;
      setData(value);
      return
    }
  })
  return {loading, isLoggined, isAuthorized, data}
}