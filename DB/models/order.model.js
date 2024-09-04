import { paymentMethods } from "../../src/utils/constants/enums.js";

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
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    address: {
      phone: String,
      street: String,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(paymentMethods),
     // default: paymentMethods.CASH,
    },
    status: {
      type: String,
      enum: ["placed", "delivered", "canceled", "refunded"],
      default: "placed",
    },
    coupon: {
      couponId: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
      },
      discount: Number,
    },
    orderPrice: Number,
    orderFinalPrice: Number,
  },

  { timestamps: true }
);
export const Order = model("Order", schema);
