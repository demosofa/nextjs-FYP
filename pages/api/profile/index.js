import { db, isAuthentication } from "../../../helpers";
import { user } from "../../../controllers";

async function profileId(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await user.getProfile(req, res);
      break;
    case "post":
      await user.updateProfile(req, res);
      break;
  }
}

export default profileId;
