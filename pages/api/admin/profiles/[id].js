import { admin } from "../../../../backend/controllers";
import { isAuthentication, isAuthorization } from "../../../../backend/helpers";
import { Role } from "../../../../shared";

async function profilesId(req, res) {
  switch (req.method.toLowerCase()) {
    case "put":
      await admin.blockOrUnblockAccount(req, res);
      break;
    case "patch":
      await admin.changeRole(req, res);
      break;
    case "delete":
      await admin.deleteAccount(req, res);
      break;
  }
}

export default isAuthentication(isAuthorization(profilesId, [Role.admin]));
