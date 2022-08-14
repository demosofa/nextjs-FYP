const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Variant = new Schema({
  name: { type: String, required: true },
  options: [
    { type: Schema.Types.ObjectId, ref: "VariantOption", required: true },
  ],
});

Variant.pre("deleteMany", { document: false, query: true }, function (next) {
  mongoose.model("VariantOption").deleteMany({ _id: { $in: this.options } });
  return next();
});

module.exports = mongoose.models.Variant || mongoose.model("Variant", Variant);
