const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductVariation = new Schema(
  {
    sku: { type: String, require: true, max: 200 },
    type: [
      { type: Schema.Types.ObjectId, ref: "VariantOption", require: true },
    ],
    price: { type: Number, require: true },
    quantity: { type: Number, require: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ProductVariation ||
  mongoose.model("ProductVariation", ProductVariation);
