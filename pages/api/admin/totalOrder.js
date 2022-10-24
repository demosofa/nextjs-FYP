import { admin } from "../../../controllers";
import { isAuthentication, isAuthorization } from "../../../helpers";
import { Role } from "../../../shared";

async function TotalOrder(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.totalOrder(req, res);
      break;
  }
}

export default isAuthentication(isAuthorization(TotalOrder, [Role.admin]));
