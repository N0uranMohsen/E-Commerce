import { User } from "../../../DB/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { message } from "../../utils/constants/msgs.js";

//add account
export const addUserAccount = catchError(async (req, res, next) => {
  //get data from req
  const { name, email, phone, password, DOB } = req.body;
  //check existance
  const userExist = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExist) return next(new AppError(message.user.alreadyExist, 400));
});

//delete Account

export const deleteUserAccount = catchError(async (req, res, next) => {
  //get data from req
  const { id } = req.params;
  //check existance
  const userexist = await User.findByIdAndDelete(id); //{},null
  if (!userexist) return next(new AppError(message.user.notFound, 404));
  res.json({ message: message.user.sucess });
});

//update account

export const updateUSerAccount = catchError(async (req, res, next) => {
  //get data from req
  const { id } = req.params;
  const { name, email, phone } = req.body;
  //check email existnace
  if (email) {
    const userExist = await User.findOne({
      _id: id,
      email: { $ne: req.user.email },
    });
    if (userExist) return next(new AppError("this mail is aleady exist ", 400));
    sendEmail(email);
  }

  const updateUser = await User.findByIdAndUpdate(
    id,
    { name, email, phone },
    { new: true }
  );
  if (!updateUser) return next(new AppError("cant update user", 404));
  res.json({ message: "updated sucessfully" });
});

//get user Account Data
export const getUserAccountData = catchError(async (req, res, next) => {
  //get data from req
  const { id } = req.params;
  //check user Exitance
  const userExist = await User.findById(id);
  if (!userExist) return next(new AppError(message.user.notFound, 404));
  res.status(200).json({ message: message.user.sucess, userExist });
});
