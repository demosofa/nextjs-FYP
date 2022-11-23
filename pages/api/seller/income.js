import { seller } from "../../../backend/controllers";
import { isAuthentication, isAuthorization } from "../../../backend/helpers";
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
