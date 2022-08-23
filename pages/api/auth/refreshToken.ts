import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../../controllers";

export default async function refreshToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await auth.refresh(req, res);
}
