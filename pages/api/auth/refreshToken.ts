import { NextApiRequest, NextApiResponse } from "next";
import { db, setCookie, Token } from "../../../helpers";

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
    setCookie(res, "refreshToken", refreshToken, { httpOnly: true, age: "1d" });
    res.status(200).json(accessToken);
  } catch (err) {
    setCookie(res, "refreshToken", "deleted", { httpOnly: true, maxAge: -1 });
    res.redirect(401, "http://localhost:3000/login");
  }
}
