import { seller } from "../../../controllers";
import { isAuthentication, isAuthorization } from "../../../helpers";
import { Role } from "../../../shared";

async function topSold(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await seller.topSold(req, res);
      break;
  }
}

export default isAuthentication(
  isAuthorization(topSold, [Role.admin, Role.seller])
);
