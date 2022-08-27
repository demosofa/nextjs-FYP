import UnitOfWork from "./services/UnitOfWork";

class UserController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  getProfile = async (req, res) => {
    const profile = await this.unit.User.getById(req.user.id);
    const { orders } = await this.unit.Account.getById(req.user.accountId)
      .select("orders")
      .populate({
        path: "orders",
        populate: {
          path: "shipper",
          select: "username",
        },
        populate: "orderItems",
      });
    if (!profile) return res.status(404).end();
    return res.status(200).json({ ...profile, orders });
  };
  updateProfile = async (req, res) => {
    const profile = await this.unit.User.getById(req.body._id);
    if (!profile) return res.status(404).end();
    const isUpdated = await this.unit.User.updateById(req.body._id, {
      $set: req.body,
    });
    if (!isUpdated) return res.status(404).end();
    return res.status(200).end();
  };
}

export default new UserController();
