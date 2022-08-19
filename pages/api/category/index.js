import { db } from "../../../helpers";
import { category } from "../../../controllers";

export default async function (req, res) {
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
