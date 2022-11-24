import { seller } from "../../../backend/controllers";
import { authenticate, authorize } from "../../../backend/helpers";
import { Role } from "../../../shared";

async function income(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await seller.income(req, res);
      break;
  }
}

export default authenticate(authorize(income, [Role.seller]));
