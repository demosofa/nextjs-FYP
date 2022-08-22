import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../helpers";
import { auth } from "../../../controllers";

export default async function refreshToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await db.connect();
  await auth.refresh(req, res);
}
