import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { db, Token } from "../../../helpers";
import { convertTime } from "../../../utils";

export default async function refreshToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await db.connect();
  try {
    const { accountId, userId, role } = Token.verifyRefreshToken(
      req.cookies.refreshToken
    ) as { accountId: string; userId: string; role: string };
    const { accessToken, refreshToken } = new Token({
      accountId,
      userId,
      role,
    });
    Cookies(req, res).set("refreshToken", refreshToken, {
      maxAge: convertTime("1d").second,
    });
    res.status(200).json(accessToken);
  } catch (err) {
    Cookies(req, res).set("refreshToken");
    res.redirect(401, "http://localhost:3000/login");
  }
}
