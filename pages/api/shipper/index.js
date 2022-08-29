import { order } from "../../../controllers";
import { isAuthentication } from "../../../helpers";

async function Shipper(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await order.MyShipping(req, res);
      break;
    case "put":
      await order.acceptShipper(req, res);
      break;
  }
}

export default isAuthentication(Shipper);
