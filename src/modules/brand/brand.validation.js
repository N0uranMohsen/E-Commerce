import joi from 'joi'
export const brandVal = joi.object({
name:joi.string().required()
}).required()


export const updatedBrandVal = joi.object({
    name:joi.string(),
    id:joi.string().hex().length(24).required()
})