import { order } from "../../../../controllers";
import { isAuthentication } from "../../../../helpers";

async function orderId(req, res) {
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
      await order.delete(req, res);
      break;
  }
}

export default isAuthentication(orderId);
