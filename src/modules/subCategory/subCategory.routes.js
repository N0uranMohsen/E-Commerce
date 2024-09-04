import { Router } from "express";
import { fileUpload } from "../../utils/fileUpload.js";
import { isValid } from "../../middleware/Validation.js";
import {
  addSubCategory,
  deleteSubCategory,
  getSubCategories,
  updateSubCategory,
} from "./subCategory.controller.js";
import { addSubCategoryVal } from "./subCategory.validation.js";
import { cloudUpload } from "../../utils/fileUpload (Cloud).js";
import { verifyToken } from "../../utils/tokenMethods.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAutorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constants/enums.js";

const subCategoryRouter = Router();
subCategoryRouter
  .route("/")
  .post(
    verifyToken,
    cloudUpload({}).single("image"),
    isValid(addSubCategoryVal),
    addSubCategory
  );
subCategoryRouter
  .route("/:id")
  .get(getSubCategories)
  .put(isAuthenticated(),isAutorized(roles.ADMIN),cloudUpload({}).single("image"), updateSubCategory)
  .delete(deleteSubCategory);

export default subCategoryRouter;
