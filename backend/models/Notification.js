import mongoose from "mongoose";
const Schema = mongoose.Schema;
const Notification = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    to: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    content: { type: String, required: true },
    link: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", Notification);
