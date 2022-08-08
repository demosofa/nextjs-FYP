import { serialize, CookieSerializeOptions } from "cookie";
import { NextApiResponse } from "next";
import { convertTime } from "../utils";

interface serializeOptions extends CookieSerializeOptions {
  age?: string;
}

interface serializeOptionsValue extends serializeOptions {
  value: string;
}

function setConfigCookie(key: string, data: any, config: serializeOptions) {
  const { age, ...others } = config;
  let defConfig: CookieSerializeOptions = {
    httpOnly: true,
    path: "/",
    ...others,
  };
  if (config.age) {
    let maxAge = convertTime(config.age).second;
    return serialize(key, data, { ...defConfig, maxAge });
  } else return serialize(key, data, defConfig);
}

export default function setCookie(
  res: NextApiResponse,
  cookies: { [key: string]: string | serializeOptionsValue },
  config?: serializeOptions
) {
  res.setHeader(
    "Set-Cookie",
    Object.entries(cookies).map((cookie) => {
      const key = cookie[0];
      const data = cookie[1];
      if (typeof data === "string") {
        return setConfigCookie(key, data as string, config);
      } else {
        const { value, ...configs } = <serializeOptionsValue>data;
        return setConfigCookie(key, String(value), { ...config, ...configs });
      }
    })
  );
}
