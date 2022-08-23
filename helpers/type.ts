import { NextApiRequest } from "next";

export type User = {
  id: string;
  role: string;
  accountId: string;
};

interface RequestUser extends NextApiRequest {
  user?: User;
}

export default RequestUser;
