import { category } from "../../../controllers";

export default async function (req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await category.getAll(req, res);
      break;
  }
}
