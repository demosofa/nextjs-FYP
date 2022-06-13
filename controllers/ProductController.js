import parseForm from "./actions/parseForm";
import UnitOfWork from "./actions/UnitOfWork";

class ProductController {
  constructor() {
    this.unit = new UnitOfWork();
  }

  async read(req, res) {
    const product = await this.unit.Product.getOne(req.query.id);
    if (!product) res.status(404).json({ errorMessage: "Not Found" });
    res.status(200).json({ ...product });
  }

  async create(req, res) {
    let result;
    await parseForm(req).then((obj) => (result = obj));
    if (!result) {
      res.status(500).json({ errorMessage: `Fail to load file` });
      return;
    }
    const check = await this.unit.Product.getOne(result.fields.title, "title");
    if (check) {
      res
        .status(500)
        .json({ errorMessage: `Product already has ${result.fields.title}` });
      return;
    }
    const product = await this.unit.Product.create({
      ...result.fields,
      files: result.files.files.map((file) => file.name),
    });
    if (!product) {
      res.status(500).json({ message: `Fail to create collection` });
      return;
    }
    res.status(200).json({ message: "Success Create Product" });
  }

  async update(req, res) {
    let result;
    await parseForm(req).then((obj) => (result = obj));
    if (!result) {
      res.status(500).json({ errorMessage: `Fail to load file` });
      return;
    }
    const check = await this.unit.Product.getOne(result.fields.title, "title");
    if (check) {
      res
        .status(500)
        .json({ errorMessage: `Product already has ${result.fields.title}` });
      return;
    }
    const product = await this.unit.Product.updateOne(
      { id: result.fields.id },
      {
        ...result.fields,
        files: result.files.files.map((file) => file.name),
      }
    );
    if (!product) {
      res.status(500).json({ message: `Fail to update collection` });
      return;
    }
    res.status(200).json({ message: "Success update Product" });
  }
}

export default new ProductController();
