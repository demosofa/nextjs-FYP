const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Account = require("./Account");

module.exports =
  Account.discriminators ||
  Account.discriminator(
    "Shipper",
    new Schema({
      shipping: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    })
  );
