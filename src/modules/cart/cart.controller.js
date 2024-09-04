import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { message } from "../../utils/constants/msgs.js";

//add Product To Cart
export const addToCart = catchError(async (req, res, next) => {
  //get data from req
  const { productId, quantity } = req.body;
  //check product existance
  const productExist = await Product.findById(productId); //null,{}
  if (!productExist) return next(new AppError(message.product.notFound, 404));
  if (!productExist.inStock(quantity))
    return next(new AppError("out of stock", 404));

  //check product exist in this cart or not
  const productInCart = await Cart.findOneAndUpdate(
    {
      user: req.user._id,
      "products.productId": productId,
    },
    { $set: { "products.$.quantity": quantity } },
    { new: true }
  );
  let data = productInCart;
  if (!productInCart) {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $push: { products: { productId, quantity } } },
      { new: true }
    );
    data = cart;
  }

  res.status(201).json({ message: "added sucessfully...", data });
});
