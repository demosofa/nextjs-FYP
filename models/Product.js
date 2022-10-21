const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema(
  {
    title: { type: String, required: true, unique: true, maxlength: 225 },
    description: { type: String, required: true, maxlength: 1000 },
    status: { type: String, required: true },
    images: [{ type: Schema.Types.ObjectId, ref: "File", required: true }],
    tags: [{ type: String }],
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    price: { type: Number },
    cost: { type: Number },
    time: { type: Date },
    sale: { type: Number },
    quantity: { type: Number },
    manufacturer: { type: String, required: true },
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    variants: [{ type: Schema.Types.ObjectId, ref: "Variant" }],
    variations: [{ type: Schema.Types.ObjectId, ref: "Variation" }],
    avgRating: { type: Number, default: 0 },
    rateCount: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

Product.index({
  title: "text",
  description: "text",
  tags: "text",
  manufacturer: "text",
});

Product.post(
  "findOneAndDelete",
  { document: false, query: true },
  async function (doc) {
    await mongoose.models.Variation.deleteMany({
      _id: { $in: doc.variations },
    });
    await mongoose.models.File.deleteMany({ _id: { $in: doc.images } });
    await mongoose.models.Variant.deleteMany({ _id: { $in: doc.variants } });
    await mongoose.models.Rate.deleteMany({ product: doc._id });
  }
);

module.exports = mongoose.models.Product || mongoose.model("Product", Product);
