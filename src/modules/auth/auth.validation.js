import joi from "joi";
import { generalFields } from "../../middleware/Validation.js";

export const signupVal = joi.object({
  name: generalFields.name.required(),
  email: generalFields.email,
  phone: generalFields.phone.required(),
  password: generalFields.password.required(),
  DOB: joi.date().required(),
});

export const otpVal = joi.object({
    email: generalFields.email,
    otp:joi.string().required()
});

export const signinVal = joi.object({
    email: generalFields.email,
    password: generalFields.password.required()
});
