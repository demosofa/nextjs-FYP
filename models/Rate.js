const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Rate = new Schema({
  account: { type: Schema.Types.ObjectId, ref: "Account" },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  rating: { type: Number },
});

module.exports = mongoose.models.Rate || mongoose.model("Rate", Rate);
