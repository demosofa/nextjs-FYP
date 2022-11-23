import { shipper } from "../../../backend/controllers";
import { isAuthentication, isAuthorization } from "../../../backend/helpers";
import { Role } from "../../../shared";

async function CountOrder(req, res) {
  await shipper.countMyShipping(req, res);
  return;
}

export default isAuthentication(
  isAuthorization(CountOrder, [Role.admin, Role.shipper])
);
