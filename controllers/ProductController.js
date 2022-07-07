import UnitOfWork from "./services/UnitOfWork";
import { parseForm } from "../helpers";

class ProductController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }

  async read(req, res) {
    const product = await this.unit.Product.getOne(req.query.id);
    if (!product) return res.status(404).json({ errorMessage: "Not Found" });
    return res.status(200).json({ ...product });
  }

  async readAll(req, res) {
    const products = await this.unit.Product.getAll();
    if (!products) return res.status(404).json({ errorMessage: "Not Found" });
    return res.status(200).json({ ...products });
  }

  async create(req, res) {
    const result = await parseForm(req).then((obj) => obj);
    if (!result)
      return res.status(500).json({ errorMessage: `Fail to load file` });
    const check = await this.unit.Product.getOne(result.fields.title, "title");
    if (check)
      return res
        .status(500)
        .json({ errorMessage: `Product already has ${result.fields.title}` });
    const { variants, ...others } = result.fields;
    const arrVariant = await Promise.all(
      variants.map((item) => {
        let parsed = JSON.parse(item);
        return this.unit.Variant.create({ ...parsed });
      })
    );
    const product = await this.unit.Product.create({
      ...others,
      files: result.files.files.map((file) => file.name),
      variants: arrVariant.map((item) => item._id),
    });
    if (!product)
      return res.status(500).json({ message: `Fail to create collection` });
    return res.status(200).json({ message: "Success Create Product" });
  }

  async update(req, res) {
    const result = await parseForm(req).then((obj) => obj);
    if (!result)
      return res.status(500).json({ errorMessage: `Fail to load file` });
    const check = await this.unit.Product.getOne(result.fields.title, "title");
    if (check)
      return res
        .status(500)
        .json({ errorMessage: `Product already has ${result.fields.title}` });
    const product = await this.unit.Product.updateById(result.fields.id, {
      ...result.fields,
      files: result.files.files.map((file) => file.name),
    });
    if (!product)
      return res.status(500).json({ message: `Fail to update collection` });
    return res.status(200).json({ message: "Success update Product" });
  }
}

export default new ProductController();
