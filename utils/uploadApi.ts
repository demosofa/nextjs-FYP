import { AxiosStatic, AxiosInstance } from "axios"

const LocalApi = process.env.NEXT_PUBLIC_LOCAL_API

export default async function uploadApi(axios: AxiosInstance | AxiosStatic, data: {path: string, files: any[]}){
  const formdata = new FormData();
  Object.entries(data).forEach((field) => {
    let key = field[0];
    const value = field[1];
    if (value instanceof Array) {
      for (var i = 0; i < value.length; i++) {
        formdata.append(key, value[i]);
      }
    } else {
      formdata.append(key, value);
    }
  });
  const arrUploaded: any[] = (await axios.post(`${LocalApi}/upload`, formdata)).data;
  const arrFile = arrUploaded.map((uploaded) => {
    const {public_id, url, bytes: size, original_filename: name, format, resource_type: type} = uploaded
    return {public_id, url, size, name, format, type}
  })
  return arrFile
}