import { product } from "../../../backend/controllers";
import { db } from "../../../backend/helpers";

export default async function productAll(req, res) {
  await db.connect();
  await product.getAll(req, res);
}
