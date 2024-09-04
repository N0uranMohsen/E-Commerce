import fs from 'fs'
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import multer ,{diskStorage}from "multer";

const fileValidation =
{
    image :['image/jpeg','image/png'],
    file:['application/pdf','application/msword']
}
export const cloudUpload= ({allowFile=fileValidation.image})=>{
    
    const storage = multer.diskStorage({})
    
    
    //Make sure that all files entered is PDF file 

    const fileFilter = ( req , file , cb ) => {
        if ( allowFile.includes(file.mimetype) ) {
            return cb ( null , true )
        }
        return cb ( new Error ( 'invalid file format' ) , false)
    }



    
    const upload = multer({ storage ,fileFilter})
    
    return upload
    }
    
    
    
    // export const singleFile = (fildName)=>{
        
    //     return fileUpload().single(fildName)
    // }
    
    // export const mixedFiles = (fildName,maxCount)=>{
    //     return fileUpload().fields(arrayOfFields)
    // }
    