import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    author: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    content: { type: String, required: true, maxLength: 150 },
    replys: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

Comment.post(
  "findOneAndDelete",
  { document: false, query: true },
  async function (doc) {
    // console.log(doc._id.toHexString());
    await Promise.all(
      doc?.replys.map((reply) =>
        mongoose.models.Comment.findByIdAndDelete(reply._id)
      )
    );
    await mongoose.models.Comment.updateOne(
      { replys: doc._id },
      { $pull: { replys: doc._id } }
    );
  }
);

export default mongoose.models.Comment || mongoose.model("Comment", Comment);
