import mongoose from "mongoose";
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
    mongoose.models.VariantOption.deleteMany({
      _id: { $in: doc.options },
    });
  }
);

export default mongoose.models.Variant || mongoose.model("Variant", Variant);
