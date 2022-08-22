import { Request } from "express";

export type User = {
  id: string;
  role: string;
  accountId: string;
};

interface RequestUser extends Request {
  user?: User;
}

export default RequestUser;
