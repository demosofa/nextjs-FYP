const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Account = require("./Account");

const Shipper = Account.discriminator(
  "Shipper",
  new Schema({
    shipping: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  })
);

module.exports = mongoose.models.Shipper || mongoose.model("Shipper", Shipper);
