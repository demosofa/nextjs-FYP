import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../../backend/controllers";
import { db } from "../../../backend/helpers";

export default async function refreshToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await db.connect();
  await auth.refresh(req, res);
}
