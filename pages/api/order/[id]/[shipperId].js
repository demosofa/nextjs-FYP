import { order } from "../../../../controllers";
import { isAuthentication } from "../../../../helpers";

async function orderId(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await order.checkQR(req, res);
      break;
  }
}

export default isAuthentication(orderId);
