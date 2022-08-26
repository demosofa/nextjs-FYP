import { NextApiRequest } from "next";

export type User = {
  id: string;
  role: string;
  accountId: string;
};

export default interface RequestUser extends NextApiRequest {
  user?: User;
}
