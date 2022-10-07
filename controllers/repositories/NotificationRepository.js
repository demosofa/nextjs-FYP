const Notification = require("../../models/Notification");
import GenericRepository from "../services/GenericRepository";
export default class NotificationRepository extends GenericRepository {
  constructor() {
    super(Notification);
  }
}
