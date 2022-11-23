import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../backend/helpers";
import { auth } from "../../../backend/controllers";

export default async function refreshToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await db.connect();
  await auth.refresh(req, res);
}
