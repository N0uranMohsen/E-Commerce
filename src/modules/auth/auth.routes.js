import { Router } from "express";
import {  forgetPassword, signin, signup, updatePassword, verifyOtp } from "./auth.controller.js";
import { otpVal, signinVal, signupVal } from "./auth.validation.js";
import { isValid } from "../../middleware/Validation.js";
import { checkExistance } from "../../middleware/checkMailORphone.js";
import { verifyToken } from "../../utils/tokenMethods.js";

const authRouter = Router();


//signup
authRouter.route("/signup").post(isValid(signupVal), checkExistance,signup);

//verify OTP
authRouter.route('/verify').post(verifyOtp)
//signin

authRouter.route('/signin').post(signin)
//forget password
authRouter.route('/forgetPassword').post(forgetPassword)
authRouter.route('/updatePassword').put(verifyToken,updatePassword)




export default authRouter
