import product from "../../../controllers/ProductController";
import dbConnect from "../../../helpers/dbConnect";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export default async function Index(req, res) {
  await dbConnect();
  switch (req.method.toLowerCase()) {
    case "get":
      product.read(req, res);
      break;
    case "post":
      await product.create(req, res);
      break;
  }
}
