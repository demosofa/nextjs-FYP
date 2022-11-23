import { admin } from "../../../backend/controllers";
import { isAuthentication, isAuthorization } from "../../../backend/helpers";
import Role from "../../../shared/Role";

async function income(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.income(req, res);
      break;
  }
}

export default isAuthentication(isAuthorization(income, [Role.admin]));
