import { db } from "../../../helpers";
import { category } from "../../../controllers";

export default async function (req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await category.read(req, res);
      break;
    case "delete":
      await category.delete(req, res);
      break;
  }
}
