import { db } from "../../../backend/helpers";
import { category } from "../../../backend/controllers";

export default async function categoryId(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await category.getSubCategories(req, res);
      break;
    case "put":
      await category.addSubCategory(req, res);
      break;
    case "patch":
      await category.update(req, res);
      break;
    case "delete":
      await category.delete(req, res);
      break;
  }
}
