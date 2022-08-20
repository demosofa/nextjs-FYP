const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
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
    await mongoose.models.Product.updateOne(
      { comments: doc._id },
      {
        $pull: {
          comments: doc._id,
        },
      }
    );
    await mongoose.model("Comment").deleteMany({ _id: { $in: doc.replys } });
    await mongoose.models.Comment.updateOne(
      { replys: doc._id },
      { $pull: { replys: doc._id } }
    );
  }
);

module.exports = mongoose.models.Comment || mongoose.model("Comment", Comment);
