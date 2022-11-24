import { admin } from "../../../../backend/controllers";
import { authenticate, authorize } from "../../../../backend/helpers";
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

export default authenticate(authorize(profilesId, [Role.admin]));
