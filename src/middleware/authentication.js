import { User } from "../../DB/models/user.model.js";
import { AppError } from "../utils/appError.js";
import { status } from "../utils/constants/enums.js";
import { message } from "../utils/constants/msgs.js";
import { verifyToken } from "../utils/tokenMethods.js";

export const isAuthenticated = () => {
  return async (req, res, next) => {
    const { token } = req.headers;
    if (!token) return next(new AppError("Token must be provided...", 400));

    const [bearer, authToken] = token.split(" "); //['bearer', ' token']
    // check token verify
    let result = "";
    if (bearer == "acessToken") {
      result = verifyToken({ token: authToken });}
else if( bearer == "resetPass"){
  result = verifyToken({ token: authToken });}



      if (result.message) {
        return next(new AppError(result.message));
      }

      //check user
      const user = await User.findOne({
        _id: result._id,

        status: status.VERIFIED,
      }).select("-password");
      //{},null

      if (!user) return next(new AppError(message.user.notFound, 401));
      req.user = user;
      next();
    
  };
};
