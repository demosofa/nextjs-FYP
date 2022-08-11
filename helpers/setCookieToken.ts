import { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage, ServerResponse } from "http";
import Cookies from "cookies";
import { Token } from ".";
import { convertTime } from "../utils";

const setCookieToken = (
  req:
    | (IncomingMessage & {
        cookies: Partial<{
          [key: string]: string;
        }>;
      })
    | NextApiRequest,
  res: ServerResponse | NextApiResponse
) => {
  try {
    const { accountId, userId, role } = Token.verifyRefreshToken(
      req.cookies.refreshToken
    ) as { accountId: string; userId: string; role: string };
    const { accessToken, refreshToken } = new Token({
      accountId,
      userId,
      role,
    });
    new Cookies(req, res)
      .set("accessToken", accessToken, {
        maxAge: convertTime("5m").milisecond,
        overwrite: true,
      })
      .set("refreshToken", refreshToken, {
        maxAge: convertTime("1d").milisecond,
        overwrite: true,
      });
    return { accountId, userId, role };
  } catch (err) {
    Cookies(req, res).set("accessToken").set("refreshToken");
    throw new Error(err.message);
  }
};

export default setCookieToken;
