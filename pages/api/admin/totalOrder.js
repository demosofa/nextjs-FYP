import { admin } from "../../../backend/controllers";
import { authenticate, authorize } from "../../../backend/helpers";
import { Role } from "../../../shared";

async function TotalOrder(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.totalOrder(req, res);
      break;
  }
}

export default authenticate(authorize(TotalOrder, [Role.admin]));
