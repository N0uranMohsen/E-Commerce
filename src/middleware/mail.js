import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { User } from "../../DB/models/user.model.js";

export const sendEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nouranmohsen720@gmail.com",
      pass: "ptbaewyynoaoofzc",
    },
    tls: {
      rejectUnauthorized: false, // Ignore self-signed certificate errors
    },
  });

  jwt.sign({ email }, "Nouran", async (err, token) => {
    let otp = Math.floor(Math.random() * 1000000 + 1);
    const user = await User.findOne({ email: email });
    user.otp = otp;
    user.otpExp = new Date(Date.now() + 10 * 60000);
    await user.save();
    const info = await transporter.sendMail({
      from: `Nouran 🎀 " <$nouranmohsen720@gmail.com>`, // sender address
      to: email, // list of receivers
      subject: "Hello ", // Subject line
      //html: "<b>Hello world?</b>"
      //  html: `<a  href='http://localhost:3000/users/verify/${token}'>Click here to verify your email</a>`, // html body
      html: `<b>your otp code : ${otp}</b>`,
    });

    console.log("Message sent: %s", info.messageId);
  });
};
