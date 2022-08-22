import { Response } from "express";
import RequestUser from "./type";
import { Token } from "./";

export default function isAuthentication(
  handler: (req: RequestUser, res: Response) => unknown
) {
  return (req: RequestUser, res: Response): unknown => {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken && !refreshToken) return res.status(401).end();
    else if (!accessToken && refreshToken)
      return res.status(401).json({ message: "Token is expired" });
    else
      try {
        const value = Token.verifyToken(accessToken) as {
          [userId: string]: string;
          role: string;
          accountId: string;
        };
        req.user = {
          id: value.userId,
          role: value.role,
          accountId: value.accountId,
        };
        return handler(req, res);
      } catch (err) {
        return res.status(401).json({ message: "Token is expired" });
      }
  };
}
