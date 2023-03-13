import models from "../models";

class NotificationController {
  getAllForUser = async (req, res) => {
    try {
      let { page, filter, limit } = req.query;
      let filterOptions = { to: req.user.accountId };
      if (filter) filterOptions = { ...filterOptions, isRead: filter };
      if (!limit) limit = 10;
      const notifications = await models.Notification.find(filterOptions)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "from", select: "username" })
        .lean();
      // const notifyCounted = await models.Notification.countData(
      //   filterOptions
      // ).lean();
      // const pageCounted = Math.ceil(notifyCounted / limit);
      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  addNotification = async (req, res) => {
    try {
      await models.Notification.create({
        ...req.body,
        from: req.user.accountId,
      });
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  readNotification = async (req, res) => {
    try {
      await models.Notification.findByIdAndUpdate(req.query.id, {
        isRead: true,
      });
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  deleteNotification = async (req, res) => {
    try {
      await models.Notification.findByIdAndDelete(req.query.id);
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}

export default new NotificationController();
