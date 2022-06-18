const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema(
  {
    title: { type: String, required: true, unique: true, maxlength: 225 },
    description: { type: String, required: true, maxlength: 255 },
    status: { type: String, required: true },
    thumbnail: { type: String, required: true },
    image: [{ type: String, required: true }],
    tags: [{ type: String }],
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    quantity: { type: Number, required: true },
    variants: [{ type: Schema.Types.ObjectId, ref: "Variant", required: true }],
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model("Product", Product);
