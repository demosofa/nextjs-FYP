import { admin } from "../../../backend/controllers";
import { authenticate, authorize } from "../../../backend/helpers";
import Role from "../../../shared/Role";

async function profitMonthly(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.profit(req, res);
      break;
  }
}

export default authenticate(authorize(profitMonthly, [Role.admin]));
