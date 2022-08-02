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
          path: "types",
          model: "VariantOption",
        },
      })
      .exec();
    if (!product) return res.status(404).json({ errorMessage: "Not Found" });
    return res.status(200).json(product);
  }

  async getAll(req, res) {
    // const { page, search, sort } = req.query;
    const products = await this.unit.Product.getAll()
      .where("status", "active")
      // .skip((page - 1) * 10)
      // .limit(10)
      // .sort({
      //   [sort]: "asc",
      // })
      .select([
        "-variants",
        "-variations",
        "-tags",
        "-status",
        "-createdAt",
        "-updatedAt",
      ])
      .populate({ path: "images", select: "url" })
      .populate("categories", "name")
      .exec();
    if (!products.length) return res.status(500).end();
    return res.status(200).json(products);
  }

  async listManagedProduct(req, res) {
    const { page, search, sort } = req.query;
    const products = await this.unit.Product.getAll()
      .skip((page - 1) * 10)
      .limit(10)
      .sort({
        [sort]: "asc",
      })
      .populate("categories", "name")
      .populate({ path: "images", select: "url" })
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
          path: "types",
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
    let productOpts = [];
    let arrVariant;
    if (variants.length) {
      arrVariant = await Promise.all(
        variants.map(async (item) => {
          const { name, options } = item;
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
    }
    let arrVariation;
    if (variations.length) {
      arrVariation = await Promise.all(
        variations.map((item) => {
          const { types, ...others } = item;
          let arrType = [];
          productOpts.forEach((opt) => {
            if (types.includes(opt.name)) arrType.push(opt._id);
          });
          return this.unit.Variation.create({ ...others, types: arrType });
        })
      );
    }
    const product = await this.unit.Product.create({
      ...others,
      images: arrImage.map((file) => file._id),
      variants: arrVariant?.map((item) => item._id),
      variations: arrVariation?.map((item) => item._id),
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
    const _id = req.query.id;
    const patched = await this.unit.Product.updateById(_id, { $set: req.body });
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
