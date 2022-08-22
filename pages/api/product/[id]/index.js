import { product } from "../../../../controllers";
import { isAuthentication } from "../../../../helpers";

export default async function (req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await product.read(req, res);
      break;
    case "patch":
      await isAuthentication(product.patch.bind(product))(req, res);
      break;
    case "delete":
      await isAuthentication(product.delete.bind(product))(req, res);
      break;
  }
}
