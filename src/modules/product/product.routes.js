import { Router } from "express";
import { cloudUpload } from "../../utils/fileUpload (Cloud).js";
import { isValid } from "../../middleware/Validation.js";
import { addProductVal } from "./product.validation.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  productRate,
} from "./product.controller.js";
import { verifyToken } from "../../utils/tokenMethods.js";
import { isAutorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constants/enums.js";

const productRouter = Router();
productRouter
  .route("/")
  .post(
    verifyToken,
    cloudUpload({}).fields([
      { name: "mainImage", maxCount: 1 },
      { name: "subImages", maxCount: 5 },
    ]),
    isValid(addProductVal),
    addProduct
  )
  .get(getAllProducts);
productRouter
  .route("/:id")
  .get(getProduct)
  .delete(verifyToken, isAutorized(roles.ADMIN), deleteProduct)
  .get(verifyToken,isAutorized(roles.ADMIN),productRate);
export default productRouter;
