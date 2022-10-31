import Role from "../shared/Role";
import { blacklist } from "../helpers";
import { OrderStatus } from "../shared";
import models from "../models";

class AdminController {
  getAllOrder = async (req, res) => {
    try {
      let { page, sort, status, limit } = req.query;
      let filterOptions = {};
      if (status)
        filterOptions = {
          ...filterOptions,
          status,
        };
      if (!limit) limit = 10;

      const lstOrder = await models.Order.find(filterOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({
          [sort]: "asc",
        })
        .populate("orderItems")
        .lean();
      if (!lstOrder) throw new Error("Fail to load profiles");
      const countOrder = await models.Order.countDocuments(
        filterOptions
      ).lean();
      const pageCounted = Math.ceil(countOrder / limit);
      return res.status(200).json({ lstOrder, pageCounted });
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  changeOrderStatus = async (req, res) => {
    const { status } = req.body;
    await models.Order.findByIdAndUpdate(req.query.id, { $set: { status } });
    return res.status(200).end();
  };

  deleteOrder = async (req, res) => {
    try {
      const deleted = await models.Order.deleteOne({
        _id: req.body.Id,
        status: {
          $in: [
            OrderStatus.progress,
            OrderStatus.pending,
            OrderStatus.cancel,
            OrderStatus.validated,
          ],
        },
      });
      if (!deleted.deletedCount) throw new Error("Fail to delete Order");
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };

  getAllProfile = async (req, res) => {
    try {
      let { search, page, sort, role, limit } = req.query;
      let filterOptions = { role: { $ne: Role.admin } };
      if (search)
        filterOptions = {
          ...filterOptions,
          $text: { $search: search },
        };
      if (role)
        filterOptions = {
          ...filterOptions,
          role,
        };
      if (!limit) limit = 10;
      const lstProfile = await models.Account.find(filterOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({
          [sort]: "asc",
        })
        .populate({ path: "user", select: ["email", "phoneNumber"] })
        .lean();
      if (!lstProfile) throw new Error("Fail to load profiles");
      const countProfiles = await models.Account.countDocuments(
        filterOptions
      ).lean();
      const pageCounted = Math.ceil(countProfiles / limit);
      return res.status(200).json({ lstProfile, pageCounted });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };

  changeRole = async (req, res) => {
    try {
      await models.Account.findByIdAndUpdate(req.query.id, {
        $set: { role: req.body.role },
      });
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };

  blockOrUnblockAccount = async (req, res) => {
    try {
      await models.Account.findByIdAndUpdate(req.query.id, {
        $set: { blocked: req.body.blocked },
      });
      if (req.body.blocked) blacklist.addToBlackList(req.query.id);
      else blacklist.removeFromBlackList(req.query.id);
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };

  deleteAccount = async (req, res) => {
    try {
      await models.Account.findByIdAndDelete(req.query.id);
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };

  income = async (req, res) => {
    const previousMonth = new Date(
      new Date().setMonth(new Date().getMonth() - 2)
    );
    try {
      const income = await models.Order.aggregate()
        .match({ createdAt: { $gte: previousMonth } })
        .project({
          month: { $month: "$createdAt" },
          sales: "$quantity",
        })
        .group({
          _id: "$month",
          total: { $sum: "$sales" },
        })
        .sort({ _id: 1 });
      res.status(200).json(income);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  profit = async (req, res) => {
    const previousMonth = new Date(
      new Date().setMonth(new Date().getMonth() - 2)
    );
    try {
      const profit = await models.Order.aggregate()
        .match({ updatedAt: { $gte: previousMonth }, status: OrderStatus.paid })
        .project({
          month: { $month: "$createdAt" },
          profit: "$total",
        })
        .group({ _id: "$month", total: { $sum: "$profit" } })
        .sort({ _id: 1 });
      return res.status(200).json(profit);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  newUsers = async (req, res) => {
    const previousMonth = new Date(
      new Date().setMonth(new Date().getMonth() - 2)
    );
    try {
      const accounts = await models.Account.aggregate()
        .match({ role: Role.customer, createdAt: { $gte: previousMonth } })
        .project({
          month: { $month: "$createdAt" },
        })
        .group({ _id: "$month", total: { $sum: 1 } })
        .sort({ _id: 1 });
      return res.status(200).json(accounts);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  totalOrder = async (req, res) => {
    const previousMonth = new Date(
      new Date().setMonth(new Date().getMonth() - 2)
    );
    try {
      const orders = await models.Order.aggregate()
        .match({ createdAt: { $gte: previousMonth } })
        .project({
          month: { $month: "$createdAt" },
        })
        .group({ _id: "$month", total: { $sum: 1 } })
        .sort({ _id: 1 });
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  topSold = async (req, res) => {
    const previousMonth = new Date(
      new Date().setMonth(new Date().getMonth() - 2)
    );
    try {
      const total = await models.OrderItem.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
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
}

export default new AdminController();
