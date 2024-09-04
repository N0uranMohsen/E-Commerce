import { model, Schema } from "mongoose";

const schema = new Schema({
    name :{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    slug:{
        type:String,
       //required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    image:{
        type: Object,
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }



},{timestamps:true,
   toJSON:{virtuals:true},
   toObject:{virtuals:true}
})
schema.virtual ( 'subCategories' , {
    localField : "_id" ,
    foreignField : "category" ,
    ref:"SubCategory"
})

schema.virtual('products',{
    localField:'_id',
    foreignField:'catgeory',
    ref:'Product'
}) 
export const Category =model('Category',schema)


