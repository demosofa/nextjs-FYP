import { seller } from "../../../backend/controllers";
import { isAuthentication, isAuthorization } from "../../../backend/helpers";
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
