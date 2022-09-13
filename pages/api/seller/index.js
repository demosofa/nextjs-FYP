import { seller } from "../../../controllers";
import { isAuthentication, isAuthorization } from "../../../helpers";
import { Role } from "../../../shared";

async function sellerIndex(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await seller.todayValidated(req, res);
      break;
  }
}

export default isAuthentication(
  isAuthorization(sellerIndex, [Role.admin, Role.seller])
);
