const Role = require("../shared/Role");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Account = new Schema(
  {
    username: { type: String, required: true, unique: true, maxlength: 50 },
    hashPassword: { type: String, required: true, maxlength: 500 },
    avatar: { type: String, default: "avatar" },
    role: {
      type: String,
      default: Role.guest,
      enum: [Role.admin, Role.vendor, Role.shipper, Role.guest, Role.manager],
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rate" }],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    blocked: { type: Boolean, default: false },
  },
  { timestamps: true, discriminatorKey: "Shipper" }
);

Account.post(
  "findOneAndDelete",
  { document: false, query: true },
  async function (doc) {
    await mongoose.models.User.deleteOne({ _id: doc.user });
    await mongoose.models.Rate.deleteMany({ _id: { $in: doc.ratings } });
    await Promise.all(
      doc.orders.map((order) =>
        mongoose.models.Order.findByIdAndDelete(order._id)
      )
    );
  }
);
module.exports = mongoose.models.Account || mongoose.model("Account", Account);
