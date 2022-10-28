import { OrderStatus } from "../shared";
import UnitOfWork from "./services/UnitOfWork";

class SellerController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  income = async (req, res) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    try {
      const income = await this.unit.Order.aggregate()
        .match({ createdAt: { $gte: yesterday } })
        .project({
          day: { $dayOfMonth: "$validatedAt" },
          sales: "$total",
        })
        .group({
          _id: "$day",
          total: { $sum: "$sales" },
        })
        .sort({ _id: 1 });
      res.status(200).json(income);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  totalOrder = async (req, res) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    try {
      const orders = await this.unit.Order.aggregate()
        .match({ createdAt: { $gte: yesterday } })
        .project({
          day: { $dayOfMonth: "$createddAt" },
        })
        .group({ _id: "$day", total: { $sum: 1 } })
        .sort({ _id: 1 });
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  topSold = async (req, res) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    try {
      const total = await this.unit.OrderItem.aggregate([
        { $match: { createdAt: { $gte: yesterday } } },
        {
          $project: {
            productId: 1,
            title: 1,
            image: 1,
            sales: "$quantity",
          },
        },
        {
          $group: {
            _id: "$productId",
            image: { $last: "$image" },
            title: { $last: "$title" },
            total: { $sum: "$sales" },
          },
        },
        {
          $sort: {
            total: -1,
          },
        },
      ]).limit(10);
      return res.status(200).json(total);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  todayValidated = async (req, res) => {
    let { page, sort, limit } = req.query;
    const currentDate = new Date();
    try {
      let filterOptions = { validatedAt: { $gte: currentDate } };
      if (!limit) limit = 10;
      const lstValidated = await this.unit.Order.getAll(filterOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({
          [sort]: "asc",
        })
        .populate("orderItems")
        .populate({ path: "shipper", select: "username" })
        .lean();
      const orderCounted = await this.unit.Order.countData({
        status: OrderStatus.shipping,
        ...filterOptions,
      }).lean();
      const pageCounted = Math.ceil(orderCounted / limit);
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
        $set: { validatedAt: Date.now(), status: OrderStatus.shipping },
      });
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json("Fail to validate this shipper order");
    }
  };
}

export default new SellerController();
