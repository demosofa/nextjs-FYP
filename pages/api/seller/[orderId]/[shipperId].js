import { seller } from "../../../../controllers";
import { isAuthentication, isAuthorization } from "../../../../helpers";
import { Role } from "../../../../shared";

async function withShipperId(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await seller.getShipperOrder(req, res);
      break;
    case "patch":
      await seller.validateShipperOrder(req, res);
      break;
  }
}

export default isAuthentication(
  isAuthorization(withShipperId, [Role.admin, Role.seller])
);
