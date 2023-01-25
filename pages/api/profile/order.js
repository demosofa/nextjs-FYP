import { user } from "../../../backend/controllers";
import { authenticate, db } from "../../../backend/helpers";

async function order(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await user.getMyOrder(req, res);
      break;
  }
}

export default authenticate(order);
