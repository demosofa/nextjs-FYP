import UnitOfWork from "./services/UnitOfWork";

class OrderController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  async getOrder(req, res) {
    const order = await this.unit.Order.getById(req.query.id).populate();
    if (!order) return res.status(500).json("Fail to get order");
    return res.status(200);
  }
  async MyOrder(req, res) {
    const history = await this.unit.Order.getAll({
      customer: req.user.id,
    })
      .populate({ path: "shipper", select: ["username"] })
      .exec();
    return res.status(200).json(history);
  }
  async lstOrder(req, res) {
    const lstOrder = await this.unit.Order.getAll()
      .where("status", "pending")
      .populate({
        path: "customer",
        select: ["username"],
      })
      .exec();
    return res.status(200).json(lstOrder);
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
    const order = await this.unit.Order.updateById(req.body.acceptedOrder, {
      $set: { shipper: req.user.id },
    });
    return res.status(200).end();
  }
  async delete(req, res) {
    const deleted = await this.unit.Order.deleteById(req.query.id);
    return res.status(200).end();
  }
}

export default new OrderController();
