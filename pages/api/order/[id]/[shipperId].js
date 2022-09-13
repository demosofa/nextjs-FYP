import { order } from "../../../../controllers";
import { isAuthentication } from "../../../../helpers";

async function shipperId(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await order.checkQR(req, res);
      break;
  }
}

export default isAuthentication(shipperId);
