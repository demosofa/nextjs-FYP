const Role = require("../helpers/Role");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./User");

const Account = new Schema(
  {
    username: { type: String, required: true, unique: true, maxlength: 50 },
    hashpassword: { type: String, required: true, maxlength: 500 },
    email: { type: String, required: true },
    avatar: { type: String, default: "avatar" },
    role: {
      type: String,
      default: "guest",
      enum: [Role.admin, Role.vendor, Role.shipper, Role.guest, Role.manager],
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

Account.pre("deleteOne", (next) => {
  User.deleteOne({ account: this._id }, next);
});
module.exports = mongoose.models.Account || mongoose.model("Account", Account);
