import { NextApiHandler } from "next";
import Cookies from "cookies";
import { Token } from ".";
import { convertTime } from "../../shared";

const setCookieToken: NextApiHandler = (req, res) => {
  try {
    const { accountId, userId, role } = Token.verifyRefreshToken(
      req.cookies.refreshToken
    ) as { accountId: string; userId: string; role: string };
    const { accessToken, refreshToken } = new Token({
      accountId,
      userId,
      role,
    });
    new Cookies(req, res).set("refreshToken", refreshToken, {
      maxAge: convertTime("1d").milisecond,
      overwrite: true,
    });
    return accessToken;
  } catch (err) {
    Cookies(req, res).set("refreshToken");
    throw new Error(err.message);
  }
};

export default setCookieToken;
