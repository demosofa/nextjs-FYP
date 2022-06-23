import dbConnect from "../../../helpers/dbConnect";
import category from "../../../controllers/CategoryController";

export default async function (req, res) {
  await dbConnect();
  switch (req.method.toLowerCase()) {
    case "get":
      await category.read(req, res);
      break;
    case "delete":
      await category.delete(req, res);
      break;
  }
}
