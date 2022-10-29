import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OrderItem = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variationId: { type: Schema.Types.ObjectId, ref: "Variation" },
    title: { type: String, required: true },
    image: { type: String, required: true },
    options: [{ type: String }],
    quantity: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.OrderItem ||
  mongoose.model("OrderItem", OrderItem);
