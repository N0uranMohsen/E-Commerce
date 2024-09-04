import { Cart } from "../../../DB/models/cart.model.js";
import { User } from "../../../DB/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { sendEmail } from "../../middleware/mail.js";
import { AppError } from "../../utils/appError.js";
import { status } from "../../utils/constants/enums.js";
import { message } from "../../utils/constants/msgs.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//signup

export const signup = catchError(async (req, res, next) => {
  //get data from req
  const { name, email, phone, password, DOB } = req.body;

  const user = new User({
    name,
    email,
    phone,
    password,
    DOB
  });

  const createdUser = await user.save();

  sendEmail(email);

  if (!createdUser) return next(new AppError("fail to create"));

  res.status(201).json({ message: message.user.sucess, user });
});

//OTP
export const verifyOtp = async (req, res, next) => {
  //get data from req
  const { email, otp } = req.body;
  const find = await User.findOne({ $and: [{ email }, { otp }] });

  if (!find) return res.json({ message: "invalid otp or mail" }); // next(new AppError("invalid Otp or mail", 404));
  console.log("valid otp");

  if (new Date() > find.otpExp) {
    return res.json({ message: "otp expires" }); //next(new AppError("otp expired"));
  }
  console.log("valid exp");

  find.status = status.VERIFIED;
  await find.save();
//create Cart 
await Cart.create({
user:find._id,
products:[]
})
  res.json({ message: "email verified successfully..." });
};

//singn

export const signin = catchError(async (req, res, next) => {
  //getdata from req

  const { email, phone, password ,role} = req.body;
  //check existance

  const user = await User.findOne({ $or: [{ email }, { phone }] });
  if (!user) return next(new AppError("email or phonew not found", 400));
  if (user.status != status.VERIFIED)
    return next(new AppError("you must be verified or signup"));

  if (!user || !bcrypt.compareSync(password, user.password))
    return next(new AppError("email or password  not valid", 401));

  jwt.sign(
    {
      _id: user._id,
      email: user.email,
      password: user.password,
      name: user.name,
      role:user.role
    },
    "SecretKey",
    async (err, token) => {
      user.active = true;
      await user.save();
      res.json({ message: "loged in sucessfully", token });
    }
  );
});

//forget Password

export const forgetPassword = catchError(async (req, res, next) => {
  //get data from req
  const { email } = req.body;
  //check existance
  const user = await User.findOne({ email });
  if (!user) return next(new AppError(message.user.notFound, 404));
  req.body.password = bcrypt.hashSync(req.body.password, 8);
  user.password = req.body.password;
  user.status = status.PENDING;
  user.active = false;
  await user.save();
  sendEmail(email);
  res.json({
    message: "check yout mail to verify your account and save the new password",
  });
});

//update Password
export const updatePassword = catchError(async (req, res, next) => {
  //get data from req
  let { oldPassword, newPassword } = req.body;

  //check old password correctance
  if (!bcrypt.compareSync(oldPassword, req.user.password))
    return next(new AppError("user Password not correct"));
  newPassword = bcrypt.hashSync(newPassword, 8);
  const ckeckPass = await User.findByIdAndUpdate(
    { _id: req.user._id },
    { password: newPassword },
    { new: true }
  );

  res.json({ message: "password updated sucessfully..", ckeckPass });
});
