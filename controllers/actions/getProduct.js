import Product from "../../models/Product";

export default function getProduct(value, props = "id") {
  return new Promise(async (resolve, reject) => {
    const product = await Product.findOne({ [props]: value }).exec();
    if (!product) reject(null);
    resolve(product);
  });
}
