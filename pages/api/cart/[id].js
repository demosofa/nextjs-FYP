import { cart } from "../../../controllers";
import { db } from "../../../helpers";

export default async function (req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await cart.read(req, res);
      break;
    case "put":
      await cart.update(req, res);
      break;
    case "patch":
      await cart.update(req, res);
      break;
    case "delete":
      await cart.remove(req, res);
      break;
  }
}
