const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Account = require("./Account");

const Shipper =
  mongoose.models.Account.discriminators["Shipper"] ||
  Account.discriminator(
    "Shipper",
    new Schema({
      shipping: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    })
  );

module.exports = Shipper;
