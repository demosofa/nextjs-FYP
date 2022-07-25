import UnitOfWork from "./services/UnitOfWork";

class CategoryController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  async read(req, res) {
    const category = await this.unit.Category.getById(req.query.id);
    return res.status(200).json({ category });
  }
  async readAll(req, res) {
    const categories = await this.unit.Category.getAll();
    return res.status(200).json({ categories });
  }
  async create(req, res) {
    const Category = await this.unit.Category.getOne({ name: req.body.name });
    if (Category)
      return res.status(300).json({
        message: "there is already an existed category",
      });
    const created = await this.unit.Category.create(req.body);
    if (!created)
      return res.status(500).json({ message: "there is error in server" });
    return res.status(200).json({ created });
  }
  async update(req, res) {
    const Category = await this.unit.Category.getById(req.body.id);
    if (!Category)
      return res.status(300).json({
        message: "there is any existed category",
      });
    const updated = await this.unit.Category.updateById(req.body.id, req.body);
    if (!updated)
      return res.status(500).json({ message: "there is error in server" });
    return res.status(200).json({ updated });
  }
  async delete(req, res) {
    const deleted = await this.unit.Category.deleteById(req.query.id);
    if (!deleted) return res.status(500).send("<p>fail<p>");
    return res.status(200).json({ deleted });
  }
}

export default new CategoryController();
