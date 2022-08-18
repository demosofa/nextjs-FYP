const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema(
  {
    name: { type: String, required: true, unique: true, maxlength: 225 },
    isFirstLevel: { type: String, enum: ["true", "false"], default: "false" },
    subCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

Category.pre(["deleteOne", "deleteMany"], function (next) {
  mongoose.models.Product.deleteOne({ categories: this._id }, next);
});

module.exports =
  mongoose.models.Category || mongoose.model("Category", Category);
