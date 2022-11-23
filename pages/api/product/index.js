import { product } from "../../../backend/controllers";
import { db, isAuthentication } from "../../../backend/helpers";

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
