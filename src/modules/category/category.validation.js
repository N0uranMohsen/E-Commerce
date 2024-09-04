import joi from 'joi'
import { generalFields } from '../../middleware/Validation.js'


export const addCategoryVal = joi.object({
    name : generalFields.name.required()
})

export const deleteCategoryVal = joi.object({
    id  : generalFields.objectId
}).required()