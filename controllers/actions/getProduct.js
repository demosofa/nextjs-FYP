import Product from "../../models/Product";

export default async function getProduct(value, props = "id") {
  return await Product.findOne({ [props]: value }).exec();
}
