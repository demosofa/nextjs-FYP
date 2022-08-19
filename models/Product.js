const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema(
  {
    title: { type: String, required: true, unique: true, maxlength: 225 },
    description: { type: String, required: true, maxlength: 255 },
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
    rating: { type: Number, default: 1 },
    time: { type: Date },
    sale: { type: Number },
    price: { type: Number },
    quantity: { type: Number },
    variants: [{ type: Schema.Types.ObjectId, ref: "Variant" }],
    variations: [{ type: Schema.Types.ObjectId, ref: "Variation" }],
    manufacturer: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

Product.post(
  "findOneAndDelete",
  { document: false, query: true },
  async function (doc) {
    await mongoose
      .model("Variation")
      .deleteMany({ _id: { $in: doc.variations } });
    await mongoose.model("File").deleteMany({ _id: { $in: doc.images } });
    await mongoose.models.Variant.deleteMany({ _id: { $in: doc.variants } });
  }
);

module.exports = mongoose.models.Product || mongoose.model("Product", Product);
