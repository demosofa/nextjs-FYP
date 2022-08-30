import { admin } from "../../../../controllers";
import { isAuthentication, isAuthorization, Role } from "../../../../helpers";

async function profilesId(req, res) {
  switch (req.method.toLowerCase()) {
    case "patch":
      await admin.changeRole(req, res);
      break;
    case "delete":
      await admin.deleteAccount(req, res);
      break;
  }
}

export default isAuthentication(
  isAuthorization(profilesId, [Role.admin, Role.guest])
);
