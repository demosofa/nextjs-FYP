import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Product = new Schema(
  {
    title: { type: String, required: true, unique: true, maxLength: 225 },
    description: { type: String, required: true, maxLength: 1000 },
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
    manufacturer: { type: String, required: true },
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
    await mongoose.models.Comment.find({ productId: doc._id }).then((arr) => {
      Promise.all(
        arr.map((comment) =>
          mongoose.models.Comment.findByIdAndDelete(comment._id)
        )
      );
    });
  }
);

export default mongoose.models.Product || mongoose.model("Product", Product);
