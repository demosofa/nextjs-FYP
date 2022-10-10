import UnitOfWork from "./services/UnitOfWork";

class SellerController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  todayValidated = async (req, res) => {
    const { page, sort } = req.query;
    const currentDate = new Date();
    try {
      let filterOptions = { validatedAt: { $gte: currentDate } };
      const lstValidated = await this.unit.Order.getAll(filterOptions)
        .skip((page - 1) * 10)
        .limit(10)
        .sort({
          [sort]: "asc",
        })
        .populate("orderItems")
        .populate({ path: "shipper", select: "username" })
        .lean();
      const orderCounted = await this.unit.Order.countData({
        status: "shipping",
        ...filterOptions,
      }).lean();
      const pageCounted = Math.ceil(orderCounted / 10);
      return res.status(200).json({ lstValidated, pageCounted });
    } catch (error) {
      return res.status(500).json("Fail to get data");
    }
  };
  getShipperOrder = async (req, res) => {
    try {
      const { shipperId, orderId } = req.query;
      const data = await this.unit.Order.getOne({
        _id: orderId,
        shipper: shipperId,
      })
        .populate({ path: "shipper", select: "username" })
        .populate("orderItems")
        .lean();
      if (data.validatedAt) throw Error();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json("Fail to load data");
    }
  };
  validateShipperOrder = async (req, res) => {
    try {
      await this.unit.Order.updateById(req.query.orderId, {
        $set: { validatedAt: Date.now(), status: "shipping" },
      });
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json("Fail to validate this shipper order");
    }
  };
}

export default new SellerController();
