import { Review } from "../../../DB/models/review.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { roles } from "../../utils/constants/enums.js";

//add review
export const addReview = catchError(async (req, res, next) => {
  //get data from req

  const { product, rate, comment } = req.body;
  //todo :check user orderd this product
  const review = new Review({
    user: req.user._id,
    product,
    rate,
    comment,
  });

  await review.save();
  //update product rate --> make it in seperate api in product controller
});
//delete req
export const deleteReview = catchError(async (req, res, next) => {
  //get data from req
  const { id } = req.params;
  const reviewExist = await Review.findById(id);
  if (!reviewExist) return next(new AppError("review not forund", 404));

  if (
    req.user._id.toString() != reviewExist.user.toString() &&
    req.user.role != roles.ADMIN
  )
    return next(new AppError("user not allowed"));
  await Review.deleteOne({ _id: id });
  res.json({ message: "deleted sucessfully.." });
});
