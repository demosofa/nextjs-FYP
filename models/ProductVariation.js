const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductVariation = new Schema(
  {
    sku: { type: String, required: true, max: 200 },
    // image: { type: Schema.Types.ObjectId, ref: "File", required: true },
    type: [
      { type: Schema.Types.ObjectId, ref: "VariantOption", required: true },
    ],
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ProductVariation ||
  mongoose.model("ProductVariation", ProductVariation);
