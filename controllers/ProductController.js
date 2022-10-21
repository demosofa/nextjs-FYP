import axios from "axios";
import UnitOfWork from "./services/UnitOfWork";
import { startSession } from "mongoose";

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
    let { page, search, sort, category, limit, filter } = req.query;
    let filterOptions = {};
    if (!page) page = 1;
    if (search)
      filterOptions = {
        ...filterOptions,
        $text: { $search: search },
      };
    if (filter) filterOptions = { ...filterOptions, title: { $ne: filter } };
    if (category) {
      const result = await this.unit.Category.getOne({ name: category }).lean();
      filterOptions = { ...filterOptions, categories: result._id };
    }
    if (!limit) limit = 10;
    const products = await this.unit.Product.aggregate()
      .match({
        status: "active",
        ...filterOptions,
      })
      .sort({
        [sort]: "asc",
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .project({
        image: { $first: "$images" },
        title: 1,
        avgRating: 1,
        price: 1,
        sale: 1,
        time: 1,
        sold: 1,
      })
      .lookup({
        from: "files",
        localField: "image",
        foreignField: "_id",
        as: "image",
      })
      .unwind("image")
      .addFields({ thumbnail: "$image.url" })
      .project({ image: 0 });
    const productCounted = await this.unit.Product.countData({
      status: "active",
      ...filterOptions,
    }).lean();
    const pageCounted = Math.ceil(productCounted / limit);
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
    let { page, search, sort, filter, category, limit } = req.query;
    let filterOptions = {};
    if (search)
      filterOptions = {
        ...filterOptions,
        $text: { $search: search },
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
    if (!limit) limit = 10;
    const products = await this.unit.Product.getAll(filterOptions)
      .skip((page - 1) * limit)
      .limit(limit)
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
    if (!products) return res.status(404).json({ message: "Not Found" });
    const productCounted = await this.unit.Product.countData(
      filterOptions
    ).lean();
    const pageCounted = Math.ceil(productCounted / limit);
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
    const session = await startSession();
    try {
      session.startTransaction();
      const arrImage = await Promise.all(
        images.map((image) => this.unit.File.create(image, { session }))
      );
      let productOpts = [];
      let arrVariant;
      if (variants.length) {
        arrVariant = await Promise.all(
          variants.map(async (item) => {
            const { name, options } = item;
            const arrOption = await Promise.all(
              options.map((opt) =>
                this.unit.Option.create({ name: opt }, { session })
              )
            );
            productOpts.push(...arrOption);
            return this.unit.Variant.create(
              {
                name,
                options: arrOption.map((opt) => opt._id),
              },
              { session }
            );
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
            return this.unit.Variation.create(
              { ...others, types: arrType },
              { session }
            );
          })
        );
      }
      await this.unit.Product.create(
        {
          ...others,
          images: arrImage.map((file) => file._id),
          variants: arrVariant?.map((item) => item._id),
          variations: arrVariation?.map((item) => item._id),
        },
        { session }
      );
      await session.commitTransaction();
      await session.endSession();
      return res.status(200).json({ message: "Success Create Product" });
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      console.log(error);
      return res.status(500).json(error);
    }
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
