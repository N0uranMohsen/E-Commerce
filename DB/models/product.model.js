import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    //Name
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      // required:true,
      trim: true,
    },
    //Related Ids
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,//todo true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,//todo true
    },
    //images
    mainImage: Object,
    subImages: [Object],
    //Price
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    //prperties
    colors: [String],
    size: [String],
    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
    rate: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 5,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
//virual atributes
schema.virtual("finalPrice").get(function () {
  return this.price - this.price * ((this.discount || 0) / 100);
});

schema.methods.inStock = function (quantity) {
  return this.stock < quantity ? false : true;
};
export const Product = model("Product", schema);
