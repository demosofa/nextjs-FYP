const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Variant = new Schema({
  name: { type: String, required: true },
  options: [{ type: Schema.Types.ObjectId, required: true }],
});

module.exports = mongoose.models.Variant || mongoose.model("Variant", Variant);
