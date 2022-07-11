const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductVariant = new Schema(
  {
    name: { type: String, require: true, max: 200 },
    type: [{ type: Schema.Types.ObjectId, ref: "Variant", require: true }],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.ProductVariant ||
  mongoose.model("ProductVariant", ProductVariant);
