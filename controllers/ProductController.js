import UnitOfWork from "./services/UnitOfWork";

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
      .populate("images")
      .populate("categories")
      .populate({
        path: "variations",
        populate: {
          path: "type",
          model: "VariantOption",
        },
      })
      .exec();
    if (!product) return res.status(404).json({ errorMessage: "Not Found" });
    return res.status(200).json(product);
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
    return res.status(200).json(products);
  }

  async create(req, res) {
    const { variants, variations, images, ...others } = req.body;
    const check = await this.unit.Product.getOne({
      title: others.title,
    });
    if (check)
      return res
        .status(500)
        .json({ errorMessage: `Product already has ${others.title}` });
    const arrImage = await Promise.all(
      images.map((image) => this.unit.File.create(image))
    );
    let newVariants = variants instanceof Array ? variants : [variants];
    let productOpts = [];
    const arrVariant = await Promise.all(
      newVariants.map(async (item) => {
        const { name, options } = JSON.parse(item);
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
      images: arrImage.map((file) => file._id),
      variants: arrVariant.map((item) => item._id),
      variations: arrVariation.map((item) => item._id),
    });
    if (!product)
      return res.status(500).json({ message: `Fail to create collection` });
    return res.status(200).json({ message: "Success Create Product" });
  }

  async update(req, res) {
    const { _id, variations, newImages, filterImages, ...others } = req.body;
    const check = await this.unit.Product.getOne({
      title: others.title,
    });
    if (check)
      return res
        .status(500)
        .json({ errorMessage: `Product already has ${others.title}` });
    await Promise.all(
      filterImages.map((image) => this.unit.File.deleteById(image._id))
    );
    const createdImages = await Promise.all(
      newImages.map((image) => this.unit.File.create(image))
    );
    await Promise.all(
      variations.map((variation) => {
        const { _id, image, ...other } = variation;
        const index = createdImages.findIndex(
          (item) => item.public_id === image
        );
        if (!index) return this.unit.Variation.updateById(_id, { $set: other });
        return this.unit.Variation.updateById(_id, {
          $set: { image: createdImages[index]._id, ...other },
        });
      })
    );
    const updated = await this.unit.Product.updateById(_id, { $set: others });
    if (!updated)
      return res.status(500).json({ message: "Fail to update product" });
    return res.status(200).json({ message: "Success update Product" });
  }

  async patch(req, res) {
    const { _id, ...others } = req.body;
    const patched = await this.unit.Product.updateById(_id, { $set: others });
    if (!patched) return res.status(500).end();
    return res.status(200).end();
  }

  async delete(req, res) {
    const deleted = await this.unit.Product.deleteById(req.query.id);
    if (!deleted) return res.status(500).end();
    return res.status(200).end();
  }
}

export default new ProductController();
