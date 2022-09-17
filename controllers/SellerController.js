import UnitOfWork from "./services/UnitOfWork";

class SellerController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  todayValidated = async (req, res) => {
    const currentDate = new Date();
    try {
      const datas = await this.unit.Order.getAll({
        validatedAt: { $gte: currentDate },
      })
        .populate("orderItems")
        .populate({ path: "shipper", select: "username" })
        .lean();
      return res.status(200).json(datas);
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
