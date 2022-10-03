import { admin } from "../../../controllers";
import { isAuthentication, isAuthorization } from "../../../helpers";
import { Role } from "../../../shared";

async function adminOrder(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.getAllOrder(req, res);
      break;
    case "delete":
      await admin.deleteOrder(req, res);
      break;
  }
}

export default isAuthentication(isAuthorization(adminOrder, Role.admin));
