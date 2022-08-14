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

Comment.pre(
  "findOneAndDelete",
  { document: false, query: true },
  async function () {
    await mongoose.model("Comment").deleteMany({ _id: { $in: this.replys } });
  }
);

module.exports = mongoose.models.Comment || mongoose.model("Comment", Comment);
