import { Router } from "express";
import { verifyToken } from "../../utils/tokenMethods.js";
import { isAutorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constants/enums.js";
import { isValid } from "../../middleware/Validation.js";
import { addUserVal } from "./admin.validation.js";
import {
  addUserAccount,
  deleteUserAccount,
  getUserAccountData,
  updateUSerAccount,
} from "./admin.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";

const adminRouter = Router();
adminRouter
  .route("/")
  .post(
   isAuthenticated(),
    isAutorized(roles.ADMIN),
    isValid(addUserVal),
    addUserAccount
  );
adminRouter
  .route("/:id")
  .delete(verifyToken, isAutorized(roles.ADMIN), deleteUserAccount)
  .put(verifyToken, isAutorized(roles.ADMIN), updateUSerAccount)
  .get(verifyToken, getUserAccountData);

export default adminRouter;
