import mongoose from "mongoose";

export const dbConn = mongoose.connect('mongodb://127.0.0.1:27017/ECommerce2')

.then(()=> console.log('db Connected sucessfully..!')).catch((err)=>console.log(err));