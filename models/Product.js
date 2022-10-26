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
    price: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    time: { type: Date },
    sale: { type: Number, default: 0 },
    quantity: { type: Number },
    manufacturer: { type: String, required: true },
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    variants: [{ type: Schema.Types.ObjectId, ref: "Variant" }],
    variations: [{ type: Schema.Types.ObjectId, ref: "Variation" }],
    avgRating: { type: Number, default: 0 },
    rateCount: { type: Number, default: 0 },
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
    await Promise.all(
      doc.variants.map((Id) => mongoose.models.Variant.findByIdAndDelete(Id))
    );
    await mongoose.models.Rate.deleteMany({ product: doc._id });
    await mongoose.models.Comment.find({ produtId: doc._id }).then((arr) => {
      Promise.all(
        arr.map((comment) =>
          mongoose.models.Comment.findByIdAndDelete(comment._id)
        )
      );
    });
  }
);

module.exports = mongoose.models.Product || mongoose.model("Product", Product);
