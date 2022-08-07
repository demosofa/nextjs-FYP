import { product } from "../../../controllers";
import { db, isAuthentication } from "../../../helpers";

async function index(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await product.listManagedProduct(req, res);
      break;
    case "post":
      await product.create(req, res);
      break;
    case "put":
      await product.update(req, res);
      break;
  }
}

export default isAuthentication(index);
