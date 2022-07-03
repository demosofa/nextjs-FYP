import type { NextApiResponse, NextApiHandler } from "next";
import Request from "./type"

export default function isAuthorization(handler: NextApiHandler, roles: string[]) : NextApiHandler{
  return (req: Request, res: NextApiResponse) : unknown => {
    if(!roles.includes(req.user.role)) return res.status(300).end();
    return handler(req, res)
  }
}