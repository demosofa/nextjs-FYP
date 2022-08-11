import UnitOfWork from "./services/UnitOfWork";

class UserController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  async getProfile(req, res) {
    const profile = await this.unit.User.getById(req.user.id);
    console.log(profile);
    if (!profile) return res.status(404).end();
    return res.status(200).json(profile);
  }
  async updateProfile(req, res) {
    const profile = await this.unit.User.getById(req.body._id);
    if (!profile) return res.status(404).end();
    const isUpdated = await this.unit.User.updateById(req.body._id, req.body);
    if (!isUpdated) return res.status(404).end();
    return res.status(200).end();
  }
}

export default new UserController();
