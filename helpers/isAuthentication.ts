import type { NextApiHandler, NextApiResponse } from "next";
import Request from "./type";
import { Token } from "./";

export default function isAuthentication(
  handler: NextApiHandler
): NextApiHandler {
  return (req: Request, res: NextApiResponse): unknown => {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken && !refreshToken) return res.status(401).end();
    else if (!accessToken && refreshToken)
      return res.status(401).json({ message: "Token is expired" });
    else
      try {
        const value = Token.verifyToken(accessToken) as {
          [userId: string]: string;
          role: string;
        };
        req.user = { id: value.userId, role: value.role };
        return handler(req, res);
      } catch (err) {
        return res.status(401).json({ message: "Token is expired" });
      }
  };
}
