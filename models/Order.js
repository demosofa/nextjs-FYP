const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "Account" },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        quantity: { type: Number, default: 1 },
      },
    ],
    ammount: { type: Number, required: true },
    address: { type: Object },
    status: {
      type: String,
      enum: ["pending", "arrived", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", Order);
