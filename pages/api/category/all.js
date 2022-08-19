import { category } from "../../../controllers";
import { db } from "../../../helpers";

export default async function (req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await category.getAll(req, res);
      break;
  }
}
