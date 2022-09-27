import type { NextApiHandler, NextApiResponse } from "next";
import RequestUser from "./type";
import { Token, blacklist } from "./";
const Account = require("../models/Account");

export default function isAuthentication(
  handler: NextApiHandler
): NextApiHandler {
  return async (req: RequestUser, res: NextApiResponse): Promise<unknown> => {
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
        const check = blacklist.isInBlackList(req.user.accountId);
        if (check === 1)
          return res.status(403).json("This account has been blocked");
        else if (check === -1) {
          try {
            await Account.findByIdAndUpdate(value.accountId, {
              $set: { blocked: false },
            });
          } catch (error) {
            console.log(error);
          }
        }
        return handler(req, res);
      } catch (err) {
        return res.status(401).json({ message: "Token is expired" });
      }
  };
}
