import { product } from "../../../backend/controllers";
import { authenticate, authorize, db } from "../../../backend/helpers";
import { Role } from "../../../shared";

async function index(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await product.listManagedProduct(req, res);
      break;
    case "post":
      await authorize(product.create, [Role.admin])(req, res);
      break;
    case "put":
      await product.update(req, res);
      break;
  }
}

export default authenticate(authorize(index, [Role.admin, Role.seller]));
