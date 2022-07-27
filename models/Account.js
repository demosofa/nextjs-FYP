const Role = require("../helpers/Role");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Account = new Schema(
  {
    username: { type: String, required: true, unique: true, maxlength: 50 },
    hashPassword: { type: String, required: true, maxlength: 500 },
    avatar: { type: String, default: "avatar" },
    role: {
      type: String,
      default: "guest",
      enum: [Role.admin, Role.vendor, Role.shipper, Role.guest, Role.manager],
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

Account.pre("deleteOne", function (next) {
  mongoose.models.User.deleteOne({ _id: this.user }, next);
});
module.exports = mongoose.models.Account || mongoose.model("Account", Account);
