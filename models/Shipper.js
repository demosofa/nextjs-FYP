const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Account = require("./Account");

const Shipper = new Schema(
  {
    shipping: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  { discriminatorKey: "Shipper" }
);

function checkDiscriminator() {
  if (Account.discriminators && Account.discriminators.Shipper) {
    return Account.discriminators.Shipper;
  }
  return Account.discriminator("Shipper", Shipper);
}

module.exports = checkDiscriminator();
