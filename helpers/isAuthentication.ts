import Request from "./type"
import type { NextApiHandler, NextApiResponse } from "next";
import { Token } from "../helpers"

export default function isAuthentication(handler: NextApiHandler) : NextApiHandler{
  return (req: Request, res: NextApiResponse) : unknown => {
    const authProp = req.headers.authorization
    if(!authProp) return res.status(300).end();
    const accessToken = authProp.split(" ")[1];
    const value: any = Token.verifyToken(accessToken)
    if(!value) return res.status(301).end();
    req.user = {id: value.userId, role: value.role}
    return handler(req, res)
  }
}