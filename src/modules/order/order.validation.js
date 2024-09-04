import joi from "joi";
import { paymentMethods } from "../../utils/constants/enums.js";
import { generalFields } from "../../middleware/Validation";
export const createOrderVal = joi.object({
  phone: joi.string(),
  street: joi.string(),

  payementMoethod: joi.string().valid(...Object.values(paymentMethods)),

  coupon: joi.string(),
});
