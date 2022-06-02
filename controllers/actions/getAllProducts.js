import Product from "../../models/Product";

export default function getAllProducts(aggregate = []) {
  return new Promise(async (resolve, reject) => {
    const products = await Product.aggregate(aggregate).exec();
    if (!products) reject(null);
    resolve(products);
  });
}
