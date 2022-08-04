import { product } from "../../../controllers";
import { db } from "../../../helpers";

export default async function (req, res) {
  await db.connect();
  await product.getAll(req, res);
}
