import { product } from "../../../controllers";

export default async function (req, res) {
  await product.getAll(req, res);
}
