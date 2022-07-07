import type { NextApiHandler, NextApiResponse } from "next";
import Request from "./type"
import { Token } from "./"

export default function isAuthentication(handler: NextApiHandler) : NextApiHandler{
  return (req: Request, res: NextApiResponse) : unknown => {
    const authProp = req.headers.authorization
    if(!authProp) return res.status(401).end();
    const currentAccessToken = authProp.split(" ")[1];
    try{
      const value = Token.verifyToken(currentAccessToken) as {[userId: string]: string, role: string}
      req.user = {id: value.userId, role: value.role}
      return handler(req, res)
    }catch(err){
      return res.status(401).json({message: "Token is expired"})
    }
  }
}