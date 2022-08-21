import { ably } from "../helpers";
import UnitOfWork from "./services/UnitOfWork";

class OrderController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  async addOrder(req, res) {
    const created = await this.unit.Order.create({
      ...req.body,
      customer: req.user.id,
    });
    if (!created) return res.status(500).json("Fail to create Order");
    const addOrderToCustomer = await this.unit.Account.updateById(req.user.id, {
      $push: { orders: created._id },
    });
    if (!addOrderToCustomer) return res.status(500).json("Fail to add Order");
    return res.status(200).json(created);
  }
  async acceptShipper(req, res) {
    const acceptedOrder = await this.unit.Shipper.updateById(req.user.id, {
      $push: {
        shipping: {
          $each: req.body.acceptedOrder,
        },
      },
    });
    if (!acceptedOrder) return res.status(500).json("Fail to accept Shipping");
    return res.status(200).end();
  }
}

export default new OrderController();
