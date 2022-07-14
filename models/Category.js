const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema({
  name: { type: String, required: true, unique: true, maxlength: 225 },
  description: { type: String, required: true, maxlength: 225 },
  // products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

Category.pre(["deleteOne", "deleteMany"], function (next) {
  mongoose.models.Product.deleteOne({ categories: this._id }, next);
});

module.exports =
  mongoose.models.Category || mongoose.model("Category", Category);
