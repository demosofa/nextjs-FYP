const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Notification = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    to: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Notification || mongoose.model("Notification", Notification);
