import { Coupon } from "../../../DB/models/coupon.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { coupunStatus } from "../../utils/constants/enums.js";
import { message } from "../../utils/constants/msgs.js";

//create coupon
export const createCoupon = catchError(async (req, res, next) => {
  //get data from req
  const { code, discount, couponType, fromDate, toDate } = req.body;
  //check code existance
  const couponExist = await Coupon.findOne({ code }); //{},null
  if (couponExist) return next(new AppError(message.coupon.alreadyExist, 404));
  //check amount
  if (couponType == coupunStatus.PRECENTAGE && discount > 100) {
    return next(new AppError("must add value bewtween 0 and 1"));
  }
  //creTE Coupon
  const createdCoupon = await Coupon.create({
    code,
    discount,
    couponType,
    fromDate,
    toDate,
    createdBy: req.user._id,
  });
  res.json({ messgae: message.coupon.sucess, data: createdCoupon });
});

