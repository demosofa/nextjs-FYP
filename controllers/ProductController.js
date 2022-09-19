import axios from "axios";
import UnitOfWork from "./services/UnitOfWork";

const LocalApi = process.env.NEXT_PUBLIC_API;

class ProductController {
  constructor(unit = UnitOfWork) {
    this.unit = new unit();
  }

  read = async (req, res) => {
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
        populate: ["types", "image"],
      })
      .lean();
    if (!product) return res.status(404).json({ errorMessage: "Not Found" });
    return res.status(200).json(product);
  };

  getAll = async (req, res) => {
    const { page, search, sort, category } = req.query;
    let filterOptions = {};
    if (search)
      filterOptions = {
        ...filterOptions,
        title: { $regex: search, $options: "i" },
      };
    if (category) {
      const result = await this.unit.Category.getOne({ name: category }).lean();
      filterOptions = { ...filterOptions, categories: result._id };
    }
    const products = await this.unit.Product.getAll(filterOptions)
      .where("status", "active")
      .skip((page - 1) * 10)
      .limit(10)
      .sort({
        [sort]: "asc",
      })
      .select([
        "_id",
        "images",
        "categories",
        "title",
        "rating",
        "time",
        "sale",
        "price",
      ])
      .populate({ path: "images", select: "url" })
      .populate("categories", "name")
      .lean();
    const productCounted = await this.unit.Product.countData({
      status: "active",
      ...filterOptions,
    }).lean();
    const pageCounted = Math.ceil(productCounted / 10);
    return res.status(200).json({ products, pageCounted });
  };

  getImage = async (req, res) => {
    const { images } = await this.unit.Product.getById(req.query.id)
      .select("images")
      .populate("images")
      .lean();
    if (!images)
      return res.status(500).json({ message: "Fail to load images" });
    return res.status(200).json(images);
  };

  getVariation = async (req, res) => {
    const { variations } = await this.unit.Product.getById(req.query.id)
      .select("variations")
      .populate({
        path: "variations",
        populate: ["types", "image"],
      })
      .lean();
    if (!variations)
      return res.status(500).json({ message: "Fail to load variations" });
    return res.status(200).json(variations);
  };

  listManagedProduct = async (req, res) => {
    const { page, search, sort, filter, category } = req.query;
    let filterOptions = {};
    if (search)
      filterOptions = {
        ...filterOptions,
        title: { $regex: search, $options: "i" },
      };
    if (category) {
      const result = await this.unit.Category.getOne({ name: category });
      filterOptions = { ...filterOptions, categories: result._id };
    }
    if (filter)
      filterOptions = {
        ...filterOptions,
        status: filter,
      };
    const products = await this.unit.Product.getAll(filterOptions)
      .skip((page - 1) * 10)
      .limit(10)
      .sort({
        [sort]: "asc",
      })
      .select(["-comments"])
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
        populate: "types",
      })
      .lean();
    if (!products) return res.status(404).json({ errorMessage: "Not Found" });
    const productCounted = await this.unit.Product.countData(
      filterOptions
    ).lean();
    const pageCounted = Math.ceil(productCounted / 10);
    return res.status(200).json({ products, pageCounted });
  };

  create = async (req, res) => {
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
  };

  update = async (req, res) => {
    const { _id, ...others } = req.body;
    const updated = await this.unit.Product.updateById(_id, { $set: others });
    if (!updated)
      return res.status(500).json({ message: "Fail to update product" });
    return res.status(200).json({ message: "Success update Product" });
  };

  putImage = async (req, res) => {
    const _id = req.query.id;
    const { newImages, filterImages } = req.body;
    if (filterImages.length) {
      const filterId = filterImages.map((image) => image._id);
      const deleted = await this.unit.File.deleteMany({
        _id: { $in: filterId },
      });
      if (!deleted)
        return res.status(500).json({ message: "Fail to delete file" });
    }
    if (newImages.length) {
      const createdImages = await Promise.all(
        newImages.map((image) => this.unit.File.create(image))
      );
      const createdIds = createdImages.map((image) => image._id);
      const updated = await this.unit.Product.updateById(_id, {
        $push: { images: { $each: createdIds } },
      });
      if (!updated)
        return res
          .status(500)
          .json({ message: "Fail to update product images" });
    }
    return res.status(200).json({ message: "Success update product images" });
  };

  patchVariation = async (req, res) => {
    const { variations } = req.body;
    const updated = await Promise.all(
      variations.map((variation) => {
        const { _id, image, ...other } = variation;
        if (!image)
          return this.unit.Variation.updateById(_id, {
            $set: other,
            $unset: { image: 1 },
          });
        return this.unit.Variation.updateById(_id, {
          $set: { image: image._id, ...other },
        });
      })
    );
    if (!updated.length)
      return res
        .status(500)
        .json({ message: "Fail to update product variations" });
    return res
      .status(200)
      .json({ message: "Success update product variations" });
  };

  patch = async (req, res) => {
    const _id = req.query.id;
    const patched = await this.unit.Product.updateById(_id, { $set: req.body });
    if (!patched) return res.status(500).end();
    return res.status(200).end();
  };

  delete = async (req, res) => {
    const { images } = await this.unit.Product.getById(req.query.id)
      .select("images")
      .populate("images");
    const selectedPublic_id = images.map((image) => image.public_id);
    const deleted = await this.unit.Product.deleteById(req.query.id);
    if (!deleted) return res.status(500).end();
    await axios.delete(`${LocalApi}/destroy`, {
      data: { files: selectedPublic_id },
    });
    return res.status(200).end();
  };
}

export default new ProductController();
