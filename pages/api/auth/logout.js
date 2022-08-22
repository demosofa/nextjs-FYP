import { db } from "../../../helpers";
import { auth } from "../../../controllers";

async function logout(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "post":
      await auth.logout(req, res);
      break;
  }
}

export default logout;
