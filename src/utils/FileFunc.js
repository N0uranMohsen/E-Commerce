import fs, { accessSync } from 'fs'
import path from 'path'
import cloudinary from './cloudinary.js'
export const deleteFile =(filePath)=>{
   let  fullPath = path.resolve(filePath)
    fs.unlinkSync(fullPath)
}

export const deleteCloud = async(public_id)=>{
   
   await cloudinary.uploader.destroy(public_id)
}