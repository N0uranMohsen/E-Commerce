import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export const Cart = model("Cart", schema);
