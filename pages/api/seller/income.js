import { seller } from "../../../controllers";
import { isAuthentication, isAuthorization } from "../../../helpers";
import { Role } from "../../../shared";

async function income(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await seller.income(req, res);
      break;
  }
}

export default isAuthentication(
  isAuthorization(income, [Role.admin, Role.seller])
);
