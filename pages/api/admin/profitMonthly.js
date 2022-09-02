import { admin } from "../../../controllers";
import { isAuthentication, isAuthorization } from "../../../helpers";
import Role from "../../../shared/Role";

async function profitMonthly(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.profit(req, res);
      break;
  }
}

export default isAuthentication(isAuthorization(profitMonthly, [Role.admin]));
