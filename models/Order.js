const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema(
  {
    customer: { type: mongoose.SchemaTypes.ObjectId, ref: "Account" },
    shipper: { type: mongoose.SchemaTypes.ObjectId, ref: "Shipper" },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        quantity: { type: Number, default: 1 },
      },
    ],
    ammount: { type: Number, required: true },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "arrived", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", Order);
