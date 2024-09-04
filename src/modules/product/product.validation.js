import joi from 'joi'
import { generalFields } from '../../middleware/Validation.js'


export const addProductVal= joi.object({
name:joi.string().required(),
description:joi.string().max(1000),
category:joi.string().hex().length(24).required()  ,
subCategory:joi.string().hex().length(24).required(),
brand:joi.string().hex().length(24).required(),
price :joi.number().min(0).required(),
discount: joi.number().min(0).optional(),
colors: generalFields.colors,
size:generalFields.size,
stock:joi.number()


}).required()