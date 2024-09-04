import { Router } from "express";
import {
  addImage,
  deleteAccount,
  getAccountData,
  updateAccount,
} from "./user.controller.js";
import { verifyToken } from "../../utils/tokenMethods.js";
import { cloudUpload } from "../../utils/fileUpload (Cloud).js";

const userRouter = Router();
userRouter
  .route("/")
  .put(verifyToken, updateAccount)
  .delete(verifyToken, deleteAccount)
  .get(verifyToken, getAccountData)
  .post(verifyToken, cloudUpload({}).single("image"), addImage);

export default userRouter;
