import { serialize, CookieSerializeOptions } from "cookie";
import { NextApiResponse } from "next";

export default function setCookie(res: NextApiResponse, name: string, value: any, opt: CookieSerializeOptions) {
  res.setHeader(
    "Set-Cookie",
    serialize(name, String(value), { path: "/", ...opt })
  );
}
