import { order } from "../../../backend/controllers";
import { db, authenticate } from "../../../backend/helpers";

async function orderIndex(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await order.lstOrder(req, res);
      break;
    case "post":
      await order.addOrder(req, res);
  }
}

export default authenticate(orderIndex);
