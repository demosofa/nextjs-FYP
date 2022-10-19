import UnitOfWork from "./services/UnitOfWork";

class ShipperController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  MyShipping = async (req, res) => {
    let { page, sort, status, limit } = req.query;
    let filterOptions = { shipper: req.user.accountId };
    if (!status)
      filterOptions = {
        ...filterOptions,
        status: { $exists: true },
      };
    if (status)
      filterOptions = {
        ...filterOptions,
        status,
      };
    if (!limit) limit = 10;
    const lstShipping = await this.unit.Order.getAll(filterOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({
        [sort]: "asc",
      })
      .populate({
        path: "customer",
        select: ["username", "user"],
        populate: {
          path: "user",
          select: ["phoneNumber", "username"],
        },
      })
      .populate("orderItems")
      .lean();
    if (!lstShipping) return res.status(404).json({ message: "Not Found" });
    const countMyShipping = await this.unit.Order.countData(
      filterOptions
    ).lean();
    const pageCounted = Math.ceil(countMyShipping / limit);
    return res.status(200).json({ lstShipping, pageCounted });
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
      // await this.unit.Account.updateOne(
      //   { _id: accountId, role },
      //   {
      //     $push: {
      //       shipping: {
      //         $each: acceptedOrders,
      //       },
      //     },
      //   }
      // );
      await this.unit.Order.updateMany(
        {
          _id: { $in: acceptedOrders },
        },
        { $set: { shipper: accountId, status: "progress" } }
      );
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}

export default new ShipperController();
