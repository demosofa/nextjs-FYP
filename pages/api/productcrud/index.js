import { product } from "../../../controllers";
import { db } from "../../../helpers";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function Index(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await product.read(req, res);
      break;
    case "post":
      await product.create(req, res);
      break;
  }
}
