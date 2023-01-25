import { order } from "../../../../backend/controllers";
import { authenticate, db } from "../../../../backend/helpers";

async function orderId(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await order.getOrder(req, res);
      break;
    case "put":
      await order.getQR(req, res);
      break;
    case "patch":
      await order.patchOrder(req, res);
      break;
    case "delete":
      await order.cancelOrder(req, res);
      break;
  }
}

export default authenticate(orderId);
