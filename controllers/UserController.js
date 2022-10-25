import UnitOfWork from "./services/UnitOfWork";

class UserController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  getProfile = async (req, res) => {
    const profile = await this.unit.User.getById(req.user.id).lean();
    if (!profile) return res.status(404).end();
    return res.status(200).json(profile);
  };
  getMyOrder = async (req, res) => {
    let { page, search, status, sort } = req.query;
    if (!sort) sort = "status";
    if (!status) status = { $exists: true };
    let { orders } = await this.unit.Account.getById(req.user.accountId)
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
          status: status,
        },
      })
      .lean();
    if (search)
      orders = orders.filter((item) => {
        const check = item.shipper.username
          .toLowerCase()
          .includes(search.toLowerCase());
        return check;
      });
    return res.status(200).json(orders);
  };
  updateProfile = async (req, res) => {
    const profile = await this.unit.User.getById(req.body._id).lean();
    if (!profile) return res.status(404).end();
    const isUpdated = await this.unit.User.updateById(req.body._id, {
      $set: req.body,
    });
    if (!isUpdated) return res.status(404).end();
    return res.status(200).end();
  };
  checkQR = async (req, res) => {
    const { shipperId, id } = req.query;
    const order = await this.unit.Order.getOne({
      _id: id,
      customer: req.user.accountId,
      shipper: shipperId,
      status: "arrived",
    })
      .populate({ path: "shipper", select: ["username"] })
      .populate("orderItems")
      .lean();
    if (!order) return res.status(500).json("This is not your order");
    return res.status(200).json(order);
  };
}

export default new UserController();
