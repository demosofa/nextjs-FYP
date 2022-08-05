const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const File = new Schema(
  {
    name: { type: String, required: true },
    public_id: { type: String, required: true, unique: true },
    format: { type: String },
    type: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

File.pre("findOneAndDelete", async function (next) {
  await mongoose.models.Product.updateOne(
    { images: this._id },
    {
      $pull: {
        images: this._id,
      },
    }
  );
  await mongoose.model("ProductVariation").updateOne(
    { image: this._id },
    {
      $unset: {
        image: 1,
      },
    }
  );
  next();
});

module.exports = mongoose.models.File || mongoose.model("File", File);
