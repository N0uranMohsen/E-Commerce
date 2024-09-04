import { User } from "../../../DB/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { sendEmail } from "../../middleware/mail.js";
import { AppError } from "../../utils/appError.js";

// //update user
export const updateAccount = catchError(async (req, res, next) => {
  //get data from req
  const { name, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true }
  );
  if (!user) return next("fail to update");
  res.json({ message: "sucess", user });
});

//Delete account
export const deleteAccount = catchError(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user._id); //null,{}
  if (!user)
    return next(
      new AppError("can not delete this user or can not find him"),
      404
    );
  res.json({ message: "sucess to delete user" });
});
//get account data

export const getAccountData = catchError(async (req, res) => {
  res.json({ message: "sucess", data: req.user });
});
//add profile image
export const addImage = catchError(async (req, res, next) => {
  //get data from req
  if (!req.file) return next(new AppError("you must add image"));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "User" }
  );
  req.body.image = { secure_url, public_id };
  const user = await UserActivation.findById(req.user._id);
  user.image = req.body.image;
  await user.save();
  res.json({ message: "user image updated sucessfully.." });
});
