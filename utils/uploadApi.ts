import { AxiosStatic, AxiosInstance } from "axios"

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API

export default async function uploadApi(axios: AxiosInstance | AxiosStatic, data: {path: string, file: any, public_id?: string}){
  const formdata = new FormData();
  Object.entries(data).forEach((field) => {
    let key = field[0];
    const value = field[1];
    formdata.append(key, value);
  });
  const uploaded = (await axios.post(`${LocalApi}/upload`, formdata)).data;
  const {public_id, url, bytes: size, original_filename: name, format, resource_type: type} = uploaded
  return {public_id, url, size, name, format, type}
}