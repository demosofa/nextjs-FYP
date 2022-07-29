const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VariantOption = new Schema({
  name: { type: String, required: true },
});

module.exports =
  mongoose.models.VariantOption ||
  mongoose.model("VariantOption", VariantOption);
