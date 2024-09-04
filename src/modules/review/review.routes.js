import { Router } from "express";
import { verifyToken } from "../../utils/tokenMethods.js";
import { addReview, deleteReview } from "./review.controller.js";

const reviewRouter =Router()

reviewRouter.route('/').post(verifyToken,addReview)
reviewRouter.route('/:id').delete(verifyToken,deleteReview)
export default reviewRouter