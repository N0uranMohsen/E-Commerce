import { Router } from "express";

import { addToCart } from "./cart.controller.js";
import { verifyToken } from "../../utils/tokenMethods.js";
import { roles } from "../../utils/constants/enums.js";
import { isAutorized } from "../../middleware/authorization.js";
import { isAuthenticated } from "../../middleware/authentication.js";

const cartRouter = Router();
cartRouter.route("/").post( isAuthenticated(),
isAutorized(roles.USER),verifyToken,  addToCart);
export default cartRouter;
