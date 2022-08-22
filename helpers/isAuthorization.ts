import { Response } from "express";
import RequestUser from "./type";

export default function isAuthorization(
  handler: (req: RequestUser, res: Response) => unknown,
  roles: string[]
) {
  return (req: RequestUser, res: Response): unknown => {
    if (!roles.includes(req.user.role)) return res.status(300).end();
    return handler(req, res);
  };
}
