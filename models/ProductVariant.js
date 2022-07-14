const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductVariant = new Schema(
  {
    name: { type: String, require: true, max: 200 },
    type: [{ type: Schema.Types.ObjectId, ref: "Variant", require: true }],
  },
  { timestamps: true }
);

ProductVariant.pre("deleteOne", function (next) {
  mongoose.models.VariantOptions.deleteOne({ _id: this.type }, next);
});

module.exports =
  mongoose.models.ProductVariant ||
  mongoose.model("ProductVariant", ProductVariant);
