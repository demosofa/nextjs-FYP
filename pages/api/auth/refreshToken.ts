import { NextApiRequest, NextApiResponse } from "next";
import {db, setCookie, Token} from "../../../helpers"

export default async function refreshToken(req: NextApiRequest, res: NextApiResponse){
  await db.connect();
  try {
    const value = Token.verifyRefreshToken(req.cookies.refreshToken);
    const {accessToken, refreshToken} = new Token(value);
    setCookie(res, 'refreshToken', refreshToken, {httpOnly: true});
    res.status(200).json({accessToken})
  }catch(err){
    setCookie(res, "refreshToken", "deleted", {httpOnly:true, maxAge: -1})
    res.redirect(401, "http://localhost:3000/login")
  }
}