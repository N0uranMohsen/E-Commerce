import { model, Schema } from "mongoose";
import { coupunStatus } from "../../src/utils/constants/enums.js";

const schema = new Schema({
  code: String,
  discount: Number,
  couponType: {
    type: String,
    enum: Object.values(coupunStatus),
    default: coupunStatus.FIXEDAMOUNT,
  },
  fromDate: {
    type: String,
    required: true,
  },
  toDate: {
    type: String,
    required: true,
  },
  assignedToUser: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      useCount: { type: Number, default: 0 },
    },
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  maxUse: { type: Number, defualt: 5 },
});

export const Coupon = model("Coupon", schema);
