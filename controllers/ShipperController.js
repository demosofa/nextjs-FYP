import UnitOfWork from "./services/UnitOfWork";

class ShipperController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  MyShipping = async (req, res) => {
    const lstShipping = await this.unit.Order.getAll({
      shipper: req.user.accountId,
    })
      .populate({
        path: "customer",
        select: ["username", "user"],
        populate: {
          path: "user",
          select: ["phoneNumber"],
        },
      })
      .populate("orderItems")
      .lean();
    return res.status(200).json(lstShipping);
  };
  countMyShipping = async (req, res) => {
    try {
      const count = await this.unit.Order.countData({
        shipper: req.user.accountId,
        status: "progress",
      }).lean();
      return res.status(200).json(count);
    } catch (error) {
      return res.status(500).json("Fail to count data");
    }
  };
  checkQR = async (req, res) => {
    const { id, orderId } = req.query;
    const order = await this.unit.Order.getOne({
      shipper: id,
      _id: orderId,
    })
      .populate({ path: "shipper", select: ["username"] })
      .populate("orderItems")
      .lean();
    return res.status(200).json(order);
  };
  acceptOrder = async (req, res) => {
    const { acceptedOrders } = req.body;
    const { accountId, role } = req.user;
    try {
      const addOrders = await this.unit.Account.updateOne(
        { _id: accountId, role },
        {
          $push: {
            shipping: {
              $each: acceptedOrders,
            },
          },
        }
      );
      await this.unit.Order.updateMany(
        {
          _id: { $in: acceptedOrders },
        },
        { $set: { shipper: accountId, status: "progress" } }
      );
      return res.status(200).end();
    } catch (error) {
      console.log(error.message);
      return res.status(500).json(error);
    }
  };
}

export default new ShipperController();
