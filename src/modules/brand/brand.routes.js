import { Router } from "express";
import { cloudUpload } from "../../utils/fileUpload (Cloud).js";
import { isValid } from "../../middleware/Validation.js";
import { brandVal, updatedBrandVal } from "./brand.validation.js";
import { addBrand, deleteBrand, updateBrand } from "./brand.controller.js";
import { verifyToken } from "../../utils/tokenMethods.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAutorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constants/enums.js";

const brandRouter = Router();
//todo auth
brandRouter
  .route("/")
  .post(
    isAuthenticated(),
    isAutorized(roles.ADMIN),
    cloudUpload({}).single("logo"),
    isValid(brandVal),
    addBrand
  );
brandRouter
  .route("/:id")
  .put(
    isAuthenticated(),
    isAutorized(roles.ADMIN),
    cloudUpload({}).single("logo"),
    isValid(updatedBrandVal),
    updateBrand
  )
  .delete(isAuthenticated(), isAutorized(roles.ADMIN), deleteBrand);

export default brandRouter;
