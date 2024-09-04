import { AppError } from "../utils/appError.js";
import { message } from "../utils/constants/msgs.js";

export const isAutorized = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(message.user.notAllowed, 401));
    }
    next();
  };
};
