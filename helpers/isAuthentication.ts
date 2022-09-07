import type { NextApiHandler, NextApiResponse } from "next";
import RequestUser from "./type";
import { Token } from "./";
import blacklist from "./blacklist";

export default function isAuthentication(
  handler: NextApiHandler
): NextApiHandler {
  return (req: RequestUser, res: NextApiResponse): unknown => {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken && !refreshToken) return res.status(401).end();
    else if (!accessToken && refreshToken)
      return res.status(401).json({ message: "Token is expired" });
    else
      try {
        const value = Token.verifyAccessToken(accessToken) as {
          [userId: string]: string;
          role: string;
          accountId: string;
        };
        req.user = {
          id: value.userId,
          role: value.role,
          accountId: value.accountId,
        };
        if (blacklist.isInBlackList(req.user.accountId))
          return res
            .status(403)
            .json({ message: "This account has been blocked" });
        return handler(req, res);
      } catch (err) {
        return res.status(401).json({ message: "Token is expired" });
      }
  };
}
