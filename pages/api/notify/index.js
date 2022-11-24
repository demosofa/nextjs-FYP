import { notification } from "../../../backend/controllers";
import { authenticate } from "../../../backend/helpers";

async function notify(req, res) {
  switch (req.method.toLowerCase()) {
    case "get":
      await notification.getAllForUser(req, res);
      break;
    case "post":
      await notification.addNotification(req, res);
      break;
  }
}

export default authenticate(notify);
