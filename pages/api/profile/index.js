import { isAuthentication } from "../../../helpers";
import { user } from "../../../controllers";

async function profileId(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await user.getProfile(req, res);
      break;
    case "put":
      await user.updateProfile(req, res);
      break;
  }
}

export default isAuthentication(profileId);
