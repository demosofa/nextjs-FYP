import { product } from "../../../../controllers";
import { isAuthentication } from "../../../../helpers";

export default async function (req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await product.read(req, res);
      break;
    case "patch":
      await isAuthentication(product.patch)(req, res);
      break;
    case "delete":
      await isAuthentication(product.delete)(req, res);
      break;
  }
}
