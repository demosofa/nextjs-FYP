import { category } from "../../../backend/controllers";
import { db } from "../../../backend/helpers";

export default async function categoryIndex(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await category.getCategoriesAreFirstLevel(req, res);
      break;
    case "post":
      await category.create(req, res);
      break;
  }
}
