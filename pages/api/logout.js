import { db, isAuthetication, isAuthorization, Role } from "../../helpers";
import { account } from "../../controllers";

async function logout(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "post":
      await account.logout(req, res);
      break;
  }
}

export default isAuthetication(isAuthorization(logout, [Role.guest]));
