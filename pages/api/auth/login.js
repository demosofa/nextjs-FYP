import { db } from "../../../helpers";
import { auth } from "../../../controllers";

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
