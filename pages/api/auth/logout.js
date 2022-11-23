import { db } from "../../../backend/helpers";
import { auth } from "../../../backend/controllers";

async function logout(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "post":
      await auth.logout(req, res);
      break;
  }
}

export default logout;
