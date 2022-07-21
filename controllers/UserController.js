import UnitOfWork from "./services/UnitOfWork";

class UserController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  async getProfile(req, res) {
    const profile = await this.unit.User.getById(req.user.id);
    if (!profile) return res.status(404).end();
    return res.status(200).json({ profile });
  }
  async updateProfile(req, res) {
    const profile = await this.unit.User.getById(req.body.userId);
    if (!profile) return res.status(404).end();
    const isUpdated = await this.unit.User.updateById(
      req.body.userId,
      req.body
    );
    if (!isUpdated.matchCount) return res.status(404).end();
    return res.status(200).end();
  }
}

export default new UserController();
