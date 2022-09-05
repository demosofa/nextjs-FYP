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

Category.post("findOneAndDelete", async function (doc) {
  await mongoose.models.Product.deleteOne({ categories: doc._id });
  await Promise.all(
    doc.subCategories.map((sub) =>
      mongoose.models.Category.findByIdAndDelete(sub._id)
    )
  );
  await mongoose.models.Category.updateOne(
    { subCategories: doc._id },
    { $pull: { subCategories: doc._id } }
  );
});

module.exports =
  mongoose.models.Category || mongoose.model("Category", Category);
