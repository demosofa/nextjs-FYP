import { seller } from "../../../backend/controllers";
import { authenticate, authorize } from "../../../backend/helpers";
import { Role } from "../../../shared";

async function totalOrder(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await seller.totalOrder(req, res);
      break;
  }
}

export default authenticate(authorize(totalOrder, [Role.seller]));
