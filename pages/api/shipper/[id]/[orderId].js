import { shipper } from "../../../../backend/controllers";
import { isAuthentication, isAuthorization } from "../../../../backend/helpers";
import { Role } from "../../../../shared";

async function withOrderId(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await shipper.checkQR(req, res);
      break;
  }
}

export default isAuthentication(
  isAuthorization(withOrderId, [Role.admin, Role.customer, Role.seller])
);
