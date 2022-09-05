import { db, isAuthentication } from "../../../helpers";
import { user } from "../../../controllers";

async function order(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await user.getMyOrder(req, res);
      break;
  }
}

export default isAuthentication(order);
