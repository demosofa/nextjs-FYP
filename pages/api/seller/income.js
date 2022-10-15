import { seller } from "../../../controllers";
import { isAuthentication, isAuthorization } from "../../../helpers";
import { Role } from "../../../shared";

async function income(req, res) {
  await seller.compareYesterday(req, res);
}

export default isAuthentication(
  isAuthorization(income, [Role.admin, Role.seller])
);
