import { user } from "../../../../backend/controllers";
import { authenticate } from "../../../../backend/helpers";

async function shipperId(req, res) {
  switch (req.method.toLowerCase()) {
    case "patch":
      await user.checkQR(req, res);
      break;
  }
}

export default authenticate(shipperId);
