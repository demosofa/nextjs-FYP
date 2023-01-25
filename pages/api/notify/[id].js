import { notification } from "../../../backend/controllers";
import { authenticate } from "../../../backend/helpers";

async function notifyId(req, res) {
  switch (req.method.toLowerCase()) {
    case "patch":
      await notification.readNotification(req, res);
      break;
    case "delete":
      await notification.deleteNotification(req, res);
      break;
  }
}

export default authenticate(notifyId);
