import { shipper } from "../../../../backend/controllers";
import { authenticate, authorize } from "../../../../backend/helpers";
import { Role } from "../../../../shared";

async function withOrderId(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await shipper.checkQR(req, res);
      break;
  }
}

export default authenticate(
  authorize(withOrderId, [Role.customer, Role.seller])
);
