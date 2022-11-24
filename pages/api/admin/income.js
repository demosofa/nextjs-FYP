import { admin } from "../../../backend/controllers";
import { authenticate, authorize } from "../../../backend/helpers";
import Role from "../../../shared/Role";

async function income(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.income(req, res);
      break;
  }
}

export default authenticate(authorize(income, [Role.admin]));
