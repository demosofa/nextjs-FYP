import { cart } from "../../../controllers";

export default async function cartId(req, res) {
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
