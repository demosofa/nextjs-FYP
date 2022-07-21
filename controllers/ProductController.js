import UnitOfWork from "./services/UnitOfWork";
import { parseForm } from "../helpers";

class ProductController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }

  async read(req, res) {
    const product = await this.unit.Product.getById(req.query.id)
      .populate({
        path: "variants",
        populate: {
          path: "options",
          model: "VariantOption",
        },
      })
      .populate({
        path: "variations",
        populate: {
          path: "type",
          model: "VariantOption",
        },
      })
      .exec();
    if (!product) return res.status(404).json({ errorMessage: "Not Found" });
    return res.status(200).json({ ...product });
  }

  async readAll(req, res) {
    const products = await this.unit.Product.getAll()
      .populate({
        path: "variants",
        populate: {
          path: "options",
          model: "VariantOption",
        },
      })
      .populate({
        path: "variations",
        populate: {
          path: "type",
          model: "VariantOption",
        },
      })
      .exec();
    if (!products) return res.status(404).json({ errorMessage: "Not Found" });
    return res.status(200).json({ ...products });
  }

  async create(req, res) {
    const result = await parseForm(req);
    if (!result)
      return res.status(500).json({ errorMessage: `Fail to load file` });
    const check = await this.unit.Product.getOne({
      title: result.fields.title,
    });
    if (check)
      return res
        .status(500)
        .json({ errorMessage: `Product already has ${result.fields.title}` });
    const { variants, variations, ...others } = result.fields;
    let newVariants = variants instanceof Array ? variants : [variants];
    let productOpts = [];
    const arrVariant = await Promise.all(
      newVariants.map(async (item) => {
        let { name, options } = JSON.parse(item);
        const arrOption = await Promise.all(
          options.map((opt) => this.unit.Option.create({ name: opt }))
        );
        productOpts.push(...arrOption);
        return this.unit.Variant.create({
          name,
          options: arrOption.map((opt) => opt._id),
        });
      })
    );
    const arrVariation = await Promise.all(
      variations.map((item) => {
        const { type, ...others } = JSON.parse(item);
        let arrType = [];
        productOpts.forEach((opt) => {
          if (type.includes(opt.name)) arrType.push(opt._id);
        });
        return this.unit.Variation.create({ ...others, type: arrType });
      })
    );
    const product = await this.unit.Product.create({
      ...others,
      images: result.files.files.map((file) => file.newFilename),
      thumbnail: result.files.thumbnail.newFilename,
      variants: arrVariant.map((item) => item._id),
      variations: arrVariation.map((item) => item._id),
    });
    if (!product)
      return res.status(500).json({ message: `Fail to create collection` });
    return res.status(200).json({ message: "Success Create Product" });
  }

  async update(req, res) {
    const result = await parseForm(req);
    if (!result)
      return res.status(500).json({ errorMessage: `Fail to load file` });
    const check = await this.unit.Product.getOne({
      title: result.fields.title,
    });
    if (check)
      return res
        .status(500)
        .json({ errorMessage: `Product already has ${result.fields.title}` });
    const product = await this.unit.Product.updateById(result.fields.id, {
      ...result.fields,
      image: result.files.files.map((file) => file.name),
    });
    if (!product)
      return res.status(500).json({ message: `Fail to update collection` });
    return res.status(200).json({ message: "Success update Product" });
  }
}

export default new ProductController();
