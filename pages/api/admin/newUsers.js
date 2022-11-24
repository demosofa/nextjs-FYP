import { admin } from "../../../backend/controllers";
import { authenticate, authorize } from "../../../backend/helpers";
import { Role } from "../../../shared";

async function NewUsers(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.newUsers(req, res);
      break;
  }
}

export default authenticate(authorize(NewUsers, [Role.admin]));
