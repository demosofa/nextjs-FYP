import { order } from "../../../controllers";
import { db, isAuthentication } from "../../../helpers";

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

export default isAuthentication(orderIndex);
