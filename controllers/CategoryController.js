import UnitOfWork from "./services/UnitOfWork";

class CategoryController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }
  getAll = async (req, res) => {
    const categories = await this.unit.Category.getAll()
      .select(["-createdAt", "-updatedAt"])
      .lean();
    if (!categories) return res.status(500).json("Fail to load all categories");
    return res.status(200).json(categories);
  };
  getSubCategories = async (req, res) => {
    const { subCategories } = await this.unit.Category.getById(req.query.id)
      .select("subCategories")
      .populate({ path: "subCategories", options: { sort: { updatedAt: -1 } } })
      .lean();
    return res.status(200).json(subCategories);
  };
  getCategoriesAreFirstLevel = async (req, res) => {
    const categories = await this.unit.Category.getAll({
      isFirstLevel: true,
    }).lean();
    return res.status(200).json(categories);
  };
  create = async (req, res) => {
    const Category = await this.unit.Category.getOne({
      isFirstLevel: true,
      name: req.body.name,
    }).lean();
    if (Category)
      return res.status(300).json({
        message: "there is already an existed category",
      });
    const created = await this.unit.Category.create(req.body);
    if (!created)
      return res.status(500).json({ message: "there is error in server" });
    return res.status(200).json(created);
  };
  addSubCategory = async (req, res) => {
    const check = await this.unit.Category.getOne({
      name: req.body.name,
    }).lean();
    if (check)
      return res
        .status(500)
        .json("there is already existed category with this name");
    const category = await this.unit.Category.create(req.body);
    const parentCategory = await this.unit.Category.updateById(req.query.id, {
      $push: { subCategories: category._id },
    });
    if (!parentCategory)
      return res
        .status(500)
        .json("Fail to update category with addition of sub category");
    return res.status(200).json(category);
  };
  update = async (req, res) => {
    const Category = await this.unit.Category.getOne({
      name: req.body.name,
      isFirstLevel: true,
    }).lean();
    if (Category)
      return res.status(300).json({
        message: "there is already existed category",
      });
    const updated = await this.unit.Category.updateById(req.query.id, {
      $set: req.body,
    });
    if (!updated)
      return res.status(500).json({ message: "there is error in server" });
    return res.status(200).json(updated);
  };
  delete = async (req, res) => {
    const coutedExist = await this.unit.Product.countData({
      categories: req.query.id,
    }).lean();
    if (coutedExist)
      return res.status(500).json("There is product having this category");
    const deleted = await this.unit.Category.deleteById(req.query.id);
    if (!deleted) return res.status(500).send("<p>fail<p>");
    return res.status(200).end();
  };
}

export default new CategoryController();
