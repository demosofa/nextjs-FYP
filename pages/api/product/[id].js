import { product } from "../../../controllers";
import { db } from "../../../helpers";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function (req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await product.read(req, res);
      break;
    case "put":
      await product.update(req, res);
      break;
    case "patch":
      await product.patch(req, res);
      break;
    case "delete":
      await product.delete(req, res);
      break;
  }
}
