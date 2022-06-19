import cart from "../../../controllers/CartController";
import dbConnect from "../../../helpers/dbConnect";

export default async function (req, res) {
  await dbConnect();
  switch (req.method.toLowerCase()) {
    case "get":
      cart.read(req, res);
      break;
    case "put":
      cart.update(req, res);
      break;
    case "patch":
      cart.update(req, res);
      break;
    case "delete":
      cart.remove(req, res);
      break;
  }
}
