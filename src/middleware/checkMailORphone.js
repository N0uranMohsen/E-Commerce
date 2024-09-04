import bcrypt from "bcrypt";
import { User } from "../../DB/models/user.model.js";
import { catchError } from "./catchError.js";
import { AppError } from "../utils/appError.js";
import { message } from "../utils/constants/msgs.js";

export const checkExistance = catchError(async (req, res, next) => {
  const isFound = await User.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  });
  if (isFound) return next(new AppError(message.user.alreadyExist));

  req.body.password = bcrypt.hashSync(req.body.password, 8);
  next();
});
