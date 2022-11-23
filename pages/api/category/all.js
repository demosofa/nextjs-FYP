import { category } from "../../../backend/controllers";
import { db } from "../../../backend/helpers";

export default async function categoryAll(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await category.getAll(req, res);
      break;
  }
}
