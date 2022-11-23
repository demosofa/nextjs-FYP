import type { NextApiHandler, NextApiResponse } from "next";
import Request from "./type";
import { Token, blacklist } from "./";
const Account = require("../models/Account");

export default function isAuthentication(
  handler: NextApiHandler
): NextApiHandler {
  return async (req: Request, res: NextApiResponse) => {
    const authProp = req.headers.authorization;
    if (!authProp) return res.status(401).end();
    try {
      const currentAccessToken = authProp.split(" ")[1];
      const value = Token.verifyAccessToken(currentAccessToken) as {
        [userId: string]: string;
        accountId: string;
        role: string;
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
