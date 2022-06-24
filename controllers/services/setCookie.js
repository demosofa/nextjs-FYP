import { serialize } from "cookie";

export default function setCookie(res, name, value, opt = {}) {
  res.setHeader(
    "Set-Cookie",
    serialize(name, String(value), { path: "/", ...opt })
  );
}
