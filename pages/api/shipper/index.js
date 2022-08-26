import { order } from "../../../controllers";
import { isAuthentication } from "../../../helpers";

async function Shipper(req, res) {
  switch (req.method.toLowerCase()) {
    case "put":
      await order.acceptShipper(req, res);
      break;
  }
}

export default isAuthentication(Shipper);
