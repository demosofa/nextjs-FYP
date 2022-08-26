import { category } from "../../../controllers";

export default async function categoryIndex(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await category.getCategoriesAreFirstLevel(req, res);
      break;
    case "post":
      await category.create(req, res);
      break;
  }
}
