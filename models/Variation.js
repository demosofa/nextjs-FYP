const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Variation = new Schema(
  {
    sku: { type: String, required: true, max: 200 },
    image: { type: Schema.Types.ObjectId, ref: "File" },
    types: [
      { type: Schema.Types.ObjectId, ref: "VariantOption", required: true },
    ],
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    time: { type: Date },
    sale: { type: Number, default: 0 },
    quantity: { type: Number, required: true },
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Variation || mongoose.model("Variation", Variation);
