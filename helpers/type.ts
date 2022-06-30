import { NextApiRequest } from "next"

export default interface Request extends NextApiRequest {
  user: user
}

interface user {
  id: string,
  role: string
}