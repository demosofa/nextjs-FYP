import { admin } from "../../../controllers";
import { isAuthentication, isAuthorization } from "../../../helpers";
import { Role } from "../../../shared";

async function NewUsers(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.newUsers(req, res);
      break;
  }
}

export default isAuthentication(isAuthorization(NewUsers, [Role.admin]));
