import { order } from "../../../controllers";
import { isAuthentication, isAuthorization } from "../../../helpers";
import { Role } from "../../../shared";

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

export default isAuthentication(
  isAuthorization(Shipper, [Role.shipper, Role.admin, Role.guest])
);
