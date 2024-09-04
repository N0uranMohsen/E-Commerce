
import joi from 'joi'
import { generalFields } from '../../middleware/Validation.js'

export const addSubCategoryVal =joi.object({
    name:generalFields.name.required(),
    category: joi.required() 
}) 