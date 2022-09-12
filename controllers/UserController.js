import UnitOfWork from "./services/UnitOfWork";

class UserController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  getProfile = async (req, res) => {
    const profile = await this.unit.User.getById(req.user.id);
    if (!profile) return res.status(404).end();
    return res.status(200).json(profile);
  };
  getMyOrder = async (req, res) => {
    let { page, status, sort } = req.query;
    if (!sort) sort = "status";
    const { orders } = await this.unit.Account.getById(req.user.accountId)
      .select("orders")
      .populate({
        path: "orders",
        populate: [
          {
            path: "shipper",
            select: "username",
          },
          "orderItems",
        ],
        options: {
          skip: (page - 1) * 10,
          limit: 10,
          sort: {
            [sort]: -1,
          },
        },
        match: {
          status,
        },
      })
      .lean();
    return res.status(200).json(orders);
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
  checkQR = async (req, res) => {
    const { shipperId, id } = req.query;
    const orders = await this.unit.Order.getAll({
      customer: req.user.accountId,
      shipper: shipperId,
      status: "arrived",
    })
      .populate({ path: "shipper", select: ["username"] })
      .populate("products")
      .lean();
    if (!orders.length) return res.status(500).json("This is not your order");
    const check = orders.findIndex((order) => order._id === id);
    if (check === -1) return res.status(500).json("This is not your order");
    return res.status(200).json(orders[check]);
  };
}

export default new UserController();
