const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = require("./Product");

const Category = new Schema({
  name: { type: String, required: true, unique: true, maxlength: 225 },
  // products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

Category.pre(["deleteOne", "deleteMany"], function (next) {
  Product.remove({ categories: this._id }, next);
});

module.exports = Category;
