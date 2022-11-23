import { admin } from "../../../backend/controllers";
import { isAuthentication, isAuthorization } from "../../../backend/helpers";
import { Role } from "../../../shared";

async function NewUsers(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.newUsers(req, res);
      break;
  }
}

export default isAuthentication(isAuthorization(NewUsers, [Role.admin]));
