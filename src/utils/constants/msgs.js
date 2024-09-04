
const generateMsg = (entity)=>({
    
        alreadyExist:`${entity} aleady exist`,
        notFound :`${entity} not found`,
        failToCreate:`fail to create ${entity}`,
        failToUpdate :`fail to update`,
        sucess:`sucess`,
        notAllowed:`${entity} not allwed..`

})
export const message =
{
    category :generateMsg('category'),
    subCategory :generateMsg('subcategroy'),
    user:generateMsg('user'),
    product:generateMsg('product'),
    coupon:generateMsg('coupon')
    ,
    brand:generateMsg('brand'),
    product:generateMsg('product')
}

