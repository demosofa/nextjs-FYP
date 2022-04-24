const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema(
  {
    title: { type: String, required: true, unique: true, maxlength: 225 },
    desc: { type: String, required: true, maxlength: 255 },
    img: { type: String, required: true },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    size: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", Product);
