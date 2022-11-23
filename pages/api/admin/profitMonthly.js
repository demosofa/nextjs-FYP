import { admin } from "../../../backend/controllers";
import { isAuthentication, isAuthorization } from "../../../backend/helpers";
import Role from "../../../shared/Role";

async function profitMonthly(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.profit(req, res);
      break;
  }
}

export default isAuthentication(isAuthorization(profitMonthly, [Role.admin]));
