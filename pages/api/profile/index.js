import { db, isAuthentication } from "../../../backend/helpers";
import { user } from "../../../backend/controllers";

async function profileId(req, res) {
  await db.connect();
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
