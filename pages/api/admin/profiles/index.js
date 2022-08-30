import { admin } from "../../../../controllers";
import { isAuthentication, isAuthorization, Role } from "../../../../helpers";

async function profilesIndex(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.getAllProfile(req, res);
      break;
  }
}

export default isAuthentication(
  isAuthorization(profilesIndex, [Role.admin, Role.guest])
);
