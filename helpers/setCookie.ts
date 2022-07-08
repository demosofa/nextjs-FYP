import { serialize, CookieSerializeOptions } from "cookie";
import { NextApiResponse } from "next";
import { convertTime } from "../utils";

interface seriallizeOptions extends CookieSerializeOptions{
  age?: string
}

export default function setCookie(res: NextApiResponse, name: string, value: any, opt: seriallizeOptions) {
  const {age, ...others} = opt;
  let config: object
  if(age){
    const maxAge = convertTime(age).second;
    config = {path: "/", maxAge, ...others}
  }
  else config = {path: "/", ...others}
  res.setHeader(
    "Set-Cookie",
    serialize(name, String(value), config)
  );
}
