import { shipper } from "../../../controllers";
import { isAuthentication, isAuthorization } from "../../../helpers";
import { Role } from "../../../shared";

async function CountOrder(req, res) {
  await shipper.countMyShipping(req, res);
  return;
}

export default isAuthentication(
  isAuthorization(CountOrder, [Role.admin, Role.shipper])
);
