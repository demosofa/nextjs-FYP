import { db } from "../../../backend/helpers";
import { auth } from "../../../backend/controllers";

export default async function login(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      break;
    case "post":
      await auth.login(req, res);
      break;
  }
}
