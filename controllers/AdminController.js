import UnitOfWork from "./services/UnitOfWork";

class AdminController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }

  getAllProfile = async (req, res) => {
    try {
      const lstProfile = await this.unit.Account.getAll().exec();
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
}

export default new AdminController();
