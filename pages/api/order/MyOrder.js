import { order } from "../../../controllers";
import { isAuthentication } from "../../../helpers";

async function MyOrder(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await order.MyOrder(req, res);
      break;
  }
}

export default isAuthentication(MyOrder);
