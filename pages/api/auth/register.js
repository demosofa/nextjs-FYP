import { db } from "../../../backend/helpers";
import { auth } from "../../../backend/controllers";

export default async function register(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "post":
      await auth.register(req, res);
      break;
  }
}
