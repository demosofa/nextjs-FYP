import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Cart = new Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "Account" },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", Cart);
