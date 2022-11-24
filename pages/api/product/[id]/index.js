import { product } from "../../../../backend/controllers";
import { db, authenticate } from "../../../../backend/helpers";

export default async function ProductId(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await product.read(req, res);
      break;
    case "patch":
      await authenticate(product.patch)(req, res);
      break;
    case "delete":
      await authenticate(product.delete)(req, res);
      break;
  }
}
