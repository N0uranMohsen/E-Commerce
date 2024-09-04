import { Router } from "express";
import { verifyToken } from "../../utils/tokenMethods.js";
import { isAutorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constants/enums.js";
import { isValid } from "../../middleware/Validation.js";
import { createCouponVal } from "./coupon.validation.js";
import { createCoupon } from "./coupon.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";

const couponRouter = Router();
couponRouter
  .route("/")
  .post(
    isAuthenticated(),
    isAutorized(roles.ADMIN),
   
    isValid(createCouponVal),
    createCoupon
  );
export default couponRouter;
