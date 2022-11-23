import { product } from "../../../../backend/controllers";
import { db, isAuthentication } from "../../../../backend/helpers";

export default async function ProductId(req, res) {
  await db.connect();
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
