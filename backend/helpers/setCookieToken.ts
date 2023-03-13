import Cookies from "cookies";
import { NextApiHandler } from "next";
import { Token } from ".";
import { convertTime } from "../../shared";

const setCookieToken: NextApiHandler = (req, res) => {
  try {
    const { username, accountId, userId, role } = Token.verifyRefreshToken(
      req.cookies.refreshToken
    ) as { username: string; accountId: string; userId: string; role: string };
    const { accessToken, refreshToken } = new Token({
      username,
      accountId,
      userId,
      role,
    });
    new Cookies(req, res).set("refreshToken", refreshToken, {
      maxAge: convertTime("1d").millisecond,
      overwrite: true,
    });
    return accessToken;
  } catch (err) {
    Cookies(req, res).set("refreshToken");
    throw new Error(err.message);
  }
};

export default setCookieToken;
