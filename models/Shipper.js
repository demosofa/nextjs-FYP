const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Account = require("./Account");

const Shipper = new Schema(
  {
    shipping: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  { discriminatorKey: "Shipper" }
);

module.exports =
  Account.discriminators || Account.discriminator("Shipper", Shipper);
