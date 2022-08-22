import { db } from "../../../helpers";
import { auth } from "../../../controllers";

export default async function (req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "post":
      await auth.register(req, res);
      break;
  }
}
