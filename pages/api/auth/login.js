import { auth } from "../../../backend/controllers";
import { db } from "../../../backend/helpers";

export default async function login(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "post":
      await auth.login(req, res);
      break;
  }
}
