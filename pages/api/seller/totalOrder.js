import { seller } from "../../../controllers";
import { isAuthentication, isAuthorization } from "../../../helpers";
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
