import { admin } from "../../../../controllers";
import { isAuthentication, isAuthorization } from "../../../../helpers";
import { Role } from "../../../../shared";

async function profilesIndex(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.getAllProfile(req, res);
      break;
  }
}

export default isAuthentication(isAuthorization(profilesIndex, [Role.admin]));
