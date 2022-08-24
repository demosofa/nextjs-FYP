import { NextApiRequest } from "next";

export default interface RequestUser extends NextApiRequest {
  user?: user;
}

interface user {
  id: string;
  role: string;
  accountId: string;
}
