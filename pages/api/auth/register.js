import { db } from "../../../helpers";
import { account } from "../../../controllers";

export default async function (req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "post":
      await account.register(req, res);
      break;
  }
}
