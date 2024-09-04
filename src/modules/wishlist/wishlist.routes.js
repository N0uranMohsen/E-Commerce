import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAutorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constants/enums.js";
import { addToWishlist, deleteFromWishList, getWishlist } from "./wishlist.controller.js";
import { verifyToken } from "../../utils/tokenMethods.js";

const wishlisRouter = Router();

wishlisRouter
  .route("/")
  .post(verifyToken,addToWishlist).get(verifyToken,getWishlist);


  wishlisRouter.delete(verifyToken,isAutorized(roles.USER),deleteFromWishList)
   
export default wishlisRouter;
