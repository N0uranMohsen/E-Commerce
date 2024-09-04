import joi from 'joi'
import { AppError } from "../utils/appError.js"; 

const parseArray =(value,helper)=>{
let parsedValue= JSON.parse(value)

let schema =joi.array().items(joi.string())
const {error} =  schema.validate(parsedValue,{abortEarly:false})
if(error)
{
helper('invalid data')
}
else{
    return true;
}

}
export const generalFields= {
    name:joi.string(),
    colors:joi.custom(parseArray),
    size:joi.custom(parseArray),
    objectId:joi.string().hex().length(24).required(),
    password:joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/),
    email:joi.string().email().required(),
    phone:joi.string().pattern(/^01[0|1|2|5]\d{8}$/)
}
export const isValid = (schema)=>{
    return (req,res,next)=>{
        let data = {...req.body,...req.params,...req.query}
        const{error}= schema.validate(data,{abortEarly:false})
        if(error){
            const arrMsg=
                error.details.map( err => err.message);

            return next(new AppError(arrMsg,400))
        }
        next()
    }

}