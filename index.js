//handle programmin errors
process.on("uncaughtException", () => {
  console.log("error in code");
});

import express from "express";
import { dbConn } from "./DB/dbConn.js";
import categoryRouter from "./src/modules/category/category.routes.js";
import { globalErrorHandling } from "./src/middleware/globalErrorHandling.js";
import subCategoryRouter from "./src/modules/subCategory/subCategory.routes.js";
import brandRouter from "./src/modules/brand/brand.routes.js";
import productRouter from "./src/modules/product/product.routes.js";
import userRouter from "./src/modules/user/user.routes.js";
import authRouter from "./src/modules/auth/auth.routes.js";
import wishlisRouter from "./src/modules/wishlist/wishlist.routes.js";
import { AppError } from "./src/utils/appError.js";
import { config } from "dotenv";
import reviewRouter from "./src/modules/review/review.routes.js";
import adminRouter from "./src/modules/admin/admin.routes.js";
import couponRouter from "./src/modules/coupon/coupon.routes.js";
import orderRouter from "./src/modules/order/order.routes.js";
import cartRouter from "./src/modules/cart/cart.routes.js";
config();
const app = express();
const port = 3000;
//app.use(cors());

app.use(express.json());
app.use("/category", categoryRouter);
app.use("/subCategory", subCategoryRouter);
app.use("/brand", brandRouter);
app.use("/product", productRouter);
app.use("/users", userRouter);
app.use("/review", reviewRouter);
app.use("/auth", authRouter);
app.use("/wishlist", wishlisRouter);
app.use("/admin", adminRouter);
app.use("/cart", cartRouter);
app.use("/coupon", couponRouter);
app.use("/order", orderRouter);
//handle unhandled routes

app.use("*", (req, res, next) => {
  //res.status(404).json({message:})
  next(new AppError(`route not found ${req.originalUrl}`, 404));
});

app.use(globalErrorHandling);
process.on("unhandledRejection", (err) => {
  console.log("error..", err);
});
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
