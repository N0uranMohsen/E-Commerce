import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    slug: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    logo: Object,
    //     {secure_url:String,
    //     puplic_id:String
    // }
  },
  { timestamps: true }
);

export const Brand = model("Brand", schema);
