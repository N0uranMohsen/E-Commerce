import { model, Schema } from "mongoose";
import { roles, status } from "../../src/utils/constants/enums.js";

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: Object.values(roles),
    default: roles.USER,
  },
  status: {
    type: String,
    enum: Object.values(status),
    default: status.PENDING,
  },
  active: {
    type: Boolean,
    default: false,
  },
  DOB: Date,
  image: {
    secure_url: String,
    public_id: String,
  },

  otp: String,
  otpExp: Date,
  wishlist: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    },
  ],
  image: Object,
});

export const User = model("User", schema);
