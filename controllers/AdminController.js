import Role from "../shared/Role";
import UnitOfWork from "./services/UnitOfWork";

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
      return res.status(500).json(error.message);
    }
  };

  changeRole = async (req, res) => {
    try {
      await this.unit.Account.updateById(req.query.id, {
        $set: { role: req.body.role },
      });
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };

  deleteAccount = async (req, res) => {
    try {
      await this.unit.Account.deleteById(req.query.id);
      return res.status(200).end();
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };

  income = async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
      new Date().setMonth(lastMonth.getMonth() - 1)
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

  topSold = async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
      new Date().setMonth(lastMonth.getMonth() - 1)
    );
    try {
      const total = await this.unit.OrderItem.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$quantity",
            title: 1,
            image: 1,
          },
        },
        {
          $group: {
            _id: "$productId",
            total: { $sum: "$sales" },
          },
        },
      ]);
      return res.status(200).json(total);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}

export default new AdminController();
