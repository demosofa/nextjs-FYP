import { OrderStatus } from "../../shared";
import models from "../models";

class ShipperController {
  MyShipping = async (req, res) => {
    let { page, sort, status, limit, orderby } = req.query;
    let filterOptions = { shipper: req.user.accountId };
    if (!orderby) orderby = -1;
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
    const lstShipping = await models.Order.find(filterOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({
        [sort]: orderby,
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
    const countMyShipping = await models.Order.countDocuments(
      filterOptions
    ).lean();
    const pageCounted = Math.ceil(countMyShipping / limit);
    return res.status(200).json({ lstShipping, pageCounted });
  };
  checkQR = async (req, res) => {
    const { id, orderId } = req.query;
    const order = await models.Order.findOne({
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
      await models.Order.updateMany(
        {
          _id: { $in: acceptedOrders },
        },
        { $set: { shipper: accountId, status: OrderStatus.progress } }
      );
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}

export default new ShipperController();
