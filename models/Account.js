const { Role } = require("../helpers");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./User");

const Account = new Schema(
  {
    username: { type: String, required: true, unique: true, maxlength: 50 },
    hashpassword: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true },
    avatar: { type: String, default: "avatar" },
    role: {
      type: String,
      default: "user",
      enum: [Role.admin, Role.seller, Role.shipper, Role.user],
    },
  },
  { timestamps: true }
);

Account.pre("deleteOne", (next) => {
  User.deleteOne({ account: this._id }, next);
});
module.exports = mongoose.models.Account || mongoose.model("Account", Account);
