import UnitOfWork from "./services/UnitOfWork";
import { toDataURL } from "qrcode";

class OrderController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  getOrder = async (req, res) => {
    const order = await this.unit.Order.getById(req.query.id).lean();
    if (!order) return res.status(500).json("Fail to get order");
    return res.status(200).json(order);
  };
  lstOrder = async (req, res) => {
    let { page, sort, limit } = req.query;
    if (!limit) limit = 10;
    const lstOrder = await this.unit.Order.getAll()
      .where("status", "pending")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({
        [sort]: "asc",
      })
      .populate({
        path: "customer",
        select: ["username"],
      })
      .lean();
    const orderCounted = await this.unit.Order.countData({
      status: "pending",
    }).lean();
    const pageCounted = Math.ceil(orderCounted / limit);
    return res.status(200).json({ lstOrder, pageCounted });
  };
  getQR = async (req, res) => {
    const url = `${req.query.id}/${req.user.accountId}`;
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
      .lean();
    if (!orders.length) return res.status(500).json("This is not your order");
    const check = orders.findIndex((order) => order._id === id);
    if (check === -1) return res.status(500).json("This is not your order");
    return res.status(200).json(orders[check]);
  };
  addOrder = async (req, res) => {
    const { products, ...others } = req.body;
    const orderItems = await Promise.all(
      products.map(async (product) => {
        const reduce = parseInt(`-${product.quantity}`);
        if (product.variationId)
          await this.unit.Variation.updateById(product.variationId, {
            $inc: { quantity: reduce },
          });
        else
          await this.unit.Product.updateById(product.productId, {
            $inc: { quantity: reduce },
          });
        return this.unit.OrderItem.create(product);
      })
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
  patchOrder = async (req, res) => {
    await this.unit.Order.updateById(req.query.id, {
      $set: req.body,
    });
    return res.status(200).end();
  };
  cancelOrder = async (req, res) => {
    await this.unit.Order.updateById(req.query.id, {
      $set: { status: "cancel" },
    })
      .select("orderItems")
      .populate("orderItems")
      .then(({ orderItems }) =>
        Promise.all(
          orderItems.map(async ({ productId, variationId, quantity }) => {
            if (variationId)
              return this.unit.Variation.updateById(variationId, {
                $inc: { quantity },
              });
            else
              return this.unit.Product.updateById(productId, {
                $inc: { quantity },
              });
          })
        )
      );
    return res.status(200).end();
  };
}

export default new OrderController();
