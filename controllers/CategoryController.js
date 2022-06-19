import parseForm from "./services/parseForm";
import UnitOfWork from "./services/UnitOfWork";

class CategoryController {
  constructor() {
    this.unit = new UnitOfWork();
  }
  async read(req, res) {
    const categories = await this.unit.Category.getAll();
    return res.status(200).json({ categories });
  }
  async create(req, res) {
    const Category = await this.unit.Category.getOne(req.body.title, "title");
    if (Category)
      return res.status(300).json({
        message: "there is already an existed category",
      });
    const created = await this.unit.Category.create(req.body);
    if (!created)
      return res.status(500).json({ message: "there is error in server" });
  }
}

export default new CategoryController();
