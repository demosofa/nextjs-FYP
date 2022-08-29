import UnitOfWork from "./services/UnitOfWork";
import { toDataURL } from "qrcode";

class OrderController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  getOrder = async (req, res) => {
    const order = await this.unit.Order.getById(req.query.id).exec();
    if (!order) return res.status(500).json("Fail to get order");
    return res.status(200).json(order);
  };
  MyOrder = async (req, res) => {
    const history = await this.unit.Order.getAll({
      customer: req.user.accountId,
    })
      .populate({ path: "shipper", select: ["username"] })
      .exec();
    return res.status(200).json(history);
  };
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
      .exec();
    return res.status(200).json(lstShipping);
  };
  lstOrder = async (req, res) => {
    const lstOrder = await this.unit.Order.getAll()
      .where("status", "pending")
      .populate({
        path: "customer",
        select: ["username"],
      })
      .exec();
    return res.status(200).json(lstOrder);
  };
  getQR = async (req, res) => {
    const api = process.env.NEXT_PUBLIC_LOCAL_API;
    const url = `${api}/order/${req.query.id}/${req.user.accountId}`;
    try {
      const generatedQR = await toDataURL(url);
      return res.status(200).json(generatedQR);
    } catch (error) {
      return res.status(500).json("Fail to get QR");
    }
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
      .exec();
    if (!orders.length) return res.status(500).json("This is not your order");
    const check = orders.findIndex((order) => order._id === id);
    if (check === -1) return res.status(500).json("This is not your order");
    return res.status(200).json(orders[check]);
  };
  addOrder = async (req, res) => {
    const { products, ...others } = req.body;
    const orderItems = await Promise.all(
      products.map((product) => this.unit.OrderItem.create(product))
    );
    const created = await this.unit.Order.create({
      ...others,
      customer: req.user.accountId,
      orderItems: orderItems.map((item) => item._id),
    });
    if (!created) return res.status(500).json("Fail to create Order");
    const addOrderToCustomer = await this.unit.Account.updateById(
      req.user.accountId,
      {
        $push: { orders: created._id },
      }
    );
    if (!addOrderToCustomer) return res.status(500).json("Fail to add Order");
    return res.status(200).end();
  };
  acceptShipper = async (req, res) => {
    const { acceptedOrders } = req.body;
    try {
      const addOrders = await this.unit.Shipper.updateById(req.user.accountId, {
        $push: {
          shipping: {
            $each: acceptedOrders,
          },
        },
      });
      await this.unit.Order.updateMany(
        {
          _id: { $in: acceptedOrders },
        },
        { $set: { shipper: req.user.accountId } }
      );
      return res.status(200).end();
    } catch (error) {
      console.log(error.message);
      return res.status(500).json(error);
    }
  };
  patchOrder = async (req, res) => {
    const patched = this.unit.Order.updateById(req.query.id, {
      $set: req.body,
    });
    return res.status(200).end();
  };
  delete = async (req, res) => {
    const deleted = await this.unit.Order.deleteById(req.query.id);
    return res.status(200).end();
  };
}

export default new OrderController();
