import { isAuthentication } from "../../../backend/helpers";
import { notification } from "../../../backend/controllers";

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

export default isAuthentication(notifyId);
