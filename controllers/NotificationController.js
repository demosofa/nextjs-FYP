import UnitOfWork from "./services/UnitOfWork";

class NotificationController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }

  getAllForUser = async (req, res) => {
    try {
      let { page, filter } = req.query;
      let filterOptions = { to: req.user.accountId };
      if (filter) filterOptions = { ...filterOptions, isRead: filter };
      const notifications = await this.unit.Notification.getAll(filterOptions)
        .sort({ updatedAt: -1 })
        .limit(5)
        .skip((page - 1) * 5)
        .populate({ path: "from", select: "username" })
        .lean();
      // const notfifyCounted = await this.unit.Notification.countData(
      //   filterOptions
      // ).lean();
      // const pageCounted = Math.ceil(notfifyCounted / 5);
      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  addNotification = async (req, res) => {
    try {
      await this.unit.Notification.create({
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
      await this.unit.Notification.updateById(req.query.id, { isRead: true });
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  deleteNotification = async (req, res) => {
    try {
      await this.unit.Notification.deleteById(req.query.id);
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}

export default new NotificationController();
