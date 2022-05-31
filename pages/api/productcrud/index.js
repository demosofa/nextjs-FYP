import product from "../../../controllers/product";
import dbConnect from "../../../helpers/dbConnect";

export default function (req, res) {
  dbConnect();
  switch (req.method.toLowerCase()) {
    case "get":
      product.read(req, res);
    case "post":
      product.create(req, res);
  }
}
