import { admin } from "../../../backend/controllers";
import { authenticate, authorize } from "../../../backend/helpers";
import { Role } from "../../../shared";

async function topSellingProduct(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.topSold(req, res);
      break;
  }
}

export default authenticate(authorize(topSellingProduct, [Role.admin]));
