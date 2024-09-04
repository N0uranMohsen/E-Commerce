import joi from "joi";
import { generalFields } from "../../middleware/Validation.js";

export const addUserVal = joi.object({
  name: generalFields.name.required(),
  email: generalFields.email,
  phone: generalFields.phone.required(),
  password: generalFields.password.required(),
  DOB: joi.date().required(),
});
