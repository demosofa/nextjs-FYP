import { NextApiRequest, NextApiResponse } from "next";
import { db, setCookieToken } from "../../../helpers";

export default async function refreshToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await db.connect();
  try {
    setCookieToken(req, res);
    res.status(200).end();
  } catch (error) {
    res.redirect(401, "http://localhost:3000/login");
  }
}
