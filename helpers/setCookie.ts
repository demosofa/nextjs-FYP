import { serialize, CookieSerializeOptions } from "cookie";
import { NextApiResponse } from "next";
import { convertTime } from "../utils";

interface seriallizeOptions extends CookieSerializeOptions{
  age?: string
}

export default function setCookie(res: NextApiResponse, name: string, value: any, opt: seriallizeOptions) {
  const {age, ...others} = opt;
  let config: CookieSerializeOptions
  if(age){
    const maxAge = convertTime(age).second;
    config = {maxAge, ...others}
  }
  else config = others
  res.setHeader(
    "Set-Cookie",
    serialize(name, String(value), {path: "/", ...config})
  );
}
