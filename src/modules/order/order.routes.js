import { Router } from "express";
import { verifyToken } from "../../utils/tokenMethods.js";
import { createOrder } from "./order.controller.js";
import { isAutorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constants/enums.js";

const orderRouter = Router();
orderRouter.route("/").post(verifyToken, createOrder);
export default orderRouter;
