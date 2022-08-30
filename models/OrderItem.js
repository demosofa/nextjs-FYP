const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItem = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  options: [{ type: String }],
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

module.exports =
  mongoose.models.OrderItem || mongoose.model("OrderItem", OrderItem);