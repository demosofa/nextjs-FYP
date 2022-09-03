import { admin } from "../../../controllers";
import { isAuthentication, isAuthorization } from "../../../helpers";
import { Role } from "../../../shared";

async function topSellingProduct(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await admin.topSold(req, res);
      break;
  }
}

export default isAuthentication(
  isAuthorization(topSellingProduct, [Role.admin])
);
