import { model, Schema } from "mongoose";

const schema = new Schema({
    name :{
        type:String,
       
    },

  slug:String,
    image:{
        type: Object,
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'Category'
    }
} , {timestamps:true,toJSON:{virtuals:true},
toObject:{virtuals:true}})

schema.virtual('products',{
    localField:'_id',
    foreignField:'catgeory',
    ref:'Product'
}) 
export const SubCategory =model('SubCategory',schema)


