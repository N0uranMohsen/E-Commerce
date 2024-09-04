import { Router } from "express";
import { fileUpload } from "../../utils/fileUpload.js";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "./category.controller.js";
import { addCategoryVal, deleteCategoryVal } from "./category.validation.js";
import { cloudUpload } from "../../utils/fileUpload (Cloud).js";
import { isValid } from "../../middleware/Validation.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAutorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constants/enums.js";
import { verifyToken } from "../../utils/tokenMethods.js";

const categoryRouter = Router();

categoryRouter
  .route("/")
  .post(
   verifyToken,
    isAutorized(roles.ADMIN),
    cloudUpload({}).single("image"),
    isValid(addCategoryVal),
    addCategory
  )
  .get(getCategories);

categoryRouter
  .route("/:id")
  .put(
    isAuthenticated(),
    isAutorized(roles.ADMIN),
    cloudUpload({}).single("image"),
    updateCategory
  )
  .delete(isValid(deleteCategoryVal), deleteCategory);
export default categoryRouter;
