import Role from "../shared/Role";
import UnitOfWork from "./services/UnitOfWork";
const blacklist = require("../helpers/blacklist");

class AdminController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }

  getAllProfile = async (req, res) => {
    try {
      const lstProfile = await this.unit.Account.getAll({
        role: { $ne: Role.admin },
      })
        .populate({ path: "user", select: ["email", "phoneNumber"] })
        .exec();
      return res.status(200).json(lstProfile);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };

  changeRole = async (req, res) => {
    try {
      await this.unit.Account.updateById(req.query.id, {
        $set: { role: req.body.role },
      });
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };

  blockOrUnblockAccount = async (req, res) => {
    try {
      await this.unit.Account.updateById(req.query.id, {
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
      await this.unit.Account.deleteById(req.query.id);
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
      const income = await this.unit.Order.aggregate()
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
      const profit = await this.unit.Order.aggregate()
        .match({ createdAt: { $gte: previousMonth }, status: "paid" })
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

  topSold = async (req, res) => {
    const previousMonth = new Date(
      new Date().setMonth(new Date().getMonth() - 2)
    );
    try {
      const total = await this.unit.OrderItem.aggregate([
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
