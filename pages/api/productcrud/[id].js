import product from "../../../controllers/ProductController";
import dbConnect from "../../../helpers/dbConnect";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function (req, res) {
  await dbConnect();
  switch (req.method.toLowerCase()) {
    case "get":
      await product.read(req, res);
      break;
    case "put":
      await product.update(req, res);
      break;
    case "patch":
      await product.update(req, res);
      break;
    case "delete":
      await product.remove(req, res);
      break;
  }
  res.end();
}
