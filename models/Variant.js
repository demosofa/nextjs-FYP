const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Variant = new Schema({
  name: { type: String, required: true },
  options: [
    { type: Schema.Types.ObjectId, ref: "VariantOption", required: true },
  ],
});

Variant.post(
  "findOneAndDelete",
  { document: false, query: true },
  function (doc) {
    mongoose.models.VariantOption.findByIdAndDelete({
      _id: { $in: doc.options },
    });
  }
);

module.exports = mongoose.models.Variant || mongoose.model("Variant", Variant);
