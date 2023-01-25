import { shipper } from "../../../backend/controllers";
import { authenticate, authorize, db } from "../../../backend/helpers";
import { Role } from "../../../shared";

async function Shipper(req, res) {
  await db.connect();
  switch (req.method.toLowerCase()) {
    case "get":
      await shipper.MyShipping(req, res);
      break;
    case "put":
      await shipper.acceptOrder(req, res);
      break;
  }
}

export default authenticate(authorize(Shipper, [Role.shipper]));
