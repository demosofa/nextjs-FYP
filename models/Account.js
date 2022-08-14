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
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rate" }],
  },
  { timestamps: true }
);

Account.pre(
  "findOneAndDelete",
  { document: false, query: true },
  function (next) {
    mongoose.models.User.deleteOne({ _id: this.user }, next);
  }
);
module.exports = mongoose.models.Account || mongoose.model("Account", Account);
