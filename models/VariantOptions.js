const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VariantOptions = new Schema({
  name: { type: String, require: true },
  variant_id: { type: Schema.Types.ObjectId, ref: "Variant", require: true },
});

module.exports =
  mongoose.models.VariantOptions ||
  mongoose.model("VariantOptions", VariantOptions);
