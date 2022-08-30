const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema(
  {
    customer: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Account",
      required: true,
    },
    shipper: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Account",
    },
    orderItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "shipping", "arrived", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", Order);
