import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Variation = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true, max: 200 },
    tags: { type: String },
    thumbnail: { type: Schema.Types.ObjectId, ref: "File" },
    types: [
      { type: Schema.Types.ObjectId, ref: "VariantOption", required: true },
    ],
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    compare: { type: Number, default: 0 },
    quantity: { type: Number, required: true },
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

Variation.index({
  title: "text",
  tags: "text",
});

export default mongoose.models.Variation ||
  mongoose.model("Variation", Variation);
