import { seller } from "../../../backend/controllers";
import { db, authenticate, authorize } from "../../../backend/helpers";
import { Role } from "../../../shared";

async function sellerIndex(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await seller.todayValidated(req, res);
      break;
  }
}

export default authenticate(authorize(sellerIndex, [Role.seller]));
