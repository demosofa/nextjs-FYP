import { seller } from "../../../backend/controllers";
import { isAuthentication, isAuthorization } from "../../../backend/helpers";
import { Role } from "../../../shared";

async function totalOrder(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await seller.totalOrder(req, res);
      break;
  }
}

export default isAuthentication(
  isAuthorization(totalOrder, [Role.admin, Role.seller])
);
