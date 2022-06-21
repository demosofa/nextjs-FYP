import dbConnect from "../../../helpers/dbConnect";
import category from "../../../controllers/CategoryController";

export default async function (req, res) {
  await dbConnect();
  switch (req.method.toLowerCase()) {
    case "delete":
      await category.delete(req, res);
      break;
  }
}
