import { db, authenticate } from "../../../backend/helpers";
import { user } from "../../../backend/controllers";

async function order(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await user.getMyOrder(req, res);
      break;
  }
}

export default authenticate(order);
