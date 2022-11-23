import { user } from "../../../../backend/controllers";
import { isAuthentication } from "../../../../backend/helpers";

async function shipperId(req, res) {
  switch (req.method.toLowerCase()) {
    case "patch":
      await user.checkQR(req, res);
      break;
  }
}

export default isAuthentication(shipperId);
