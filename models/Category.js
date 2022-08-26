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

Category.post(
  ["findOnedAndDelete", "deleteMany"],
  { document: false, query: true },
  async function (doc) {
    console.log(this);
    await mongoose.models.Product.deleteOne({ categories: doc._id });
    await mongoose.models.Category.deleteMany({
      _id: { $in: doc.subCategories },
    });
  }
);

module.exports =
  mongoose.models.Category || mongoose.model("Category", Category);
