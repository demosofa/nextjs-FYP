import { Request, Response } from "next";
import { auth } from "../../../controllers";

export default async function refreshToken(req: Request, res: Response) {
  await auth.refresh(req, res);
}
