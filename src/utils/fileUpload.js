import fs from 'fs'
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import multer ,{diskStorage}from "multer";

const fileValidation =
{
    image :['image/jpeg','image/png'],
    file:['application/pdf','application/msword']
}
export const fileUpload= ({folder,allowFile=fileValidation.image})=>{
    
    const storage = multer.diskStorage({
        destination:  (req, file, cb)=> {
         //find the full path from 
         const fullPath = path.resolve(`uploads/${folder}`)
            if(!fs.existsSync(fullPath)){
               
                //create this folder if not found
                fs.mkdirSync(fullPath , { recursive : true } )
            }

        cb(null, `uploads/${folder}`)
        },

        filename :  (req, file, cb)=> {
           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uuidv4()+'-'+file.originalname)
        }
    })
    
    
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
    