import dbConnect from "../../../helpers/dbConnect";
import category from "../../../controllers/CategoryController";

export default async function (req, res) {
  await dbConnect();
  switch (req.method.toLowerCase()) {
    case "get":
      await category.read(req, res);
      break;
    case "post":
      await category.create(req, res);
      break;
  }
  res.end();
}
