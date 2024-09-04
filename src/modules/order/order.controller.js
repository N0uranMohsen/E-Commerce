import { Cart } from "../../../DB/models/cart.model.js";
import { Coupon } from "../../../DB/models/coupon.model.js";
import { Order } from "../../../DB/models/order.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import { coupunStatus } from "../../utils/constants/enums.js";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51Pr3I7H0zUN2A9GJYaXMrmRbDZiajSbp8QUh02jYjuN80sB3Yad9dXyr980Y69tSJIFBt7l0x7g6VIydJsT3Z6GX00gajyGUy3"
);
//create order

export const createOrder = catchError(async (req, res, next) => {
  //get data from req

  const { phone, street, coupon, paymentMethod } = req.body;

  let couponExist = "";

  if (coupon) {
    couponExist = await Coupon.findOne({
      code: coupon,
      toDate: { $gte: Date.now() },
      fromDate: { $lte: Date.now() },
    }); //{},null

    console.log("date now is ", Date.now().toString(), "\n", couponExist);

    if (!couponExist) return next(new AppError("invalid coupon...", 400));
  }

  if (couponExist) {
    let flag = 0;
    for (let i = 0; i < couponExist.assignedToUser.length; i++) {
      if (couponExist.assignedToUser[i].userId.toString() == req.user._id) {
        if (
          couponExist.assignedToUser[i].useCount >=
          couponExist.maxUse
        )
          return next(
            new AppError("you exceded the number of use this coupon")
          );
        couponExist.assignedToUser[i].useCount += 1;
        flag = 1;
        break;
      }
    }

    if (!flag) {
      couponExist.assignedToUser.push({
        userId: req.user._id,
        useCount: 1,
      });
    }
  }

  //check cart
  const cart = await Cart.findOne({ user: req.user._id }); ///{},null
  if (!cart) return next(new AppError("you dont have cart..", 404));

  const products = cart.products;
  if (products.length < 1) return next(new AppError("your cart is empty.."));

  //check products exitance and quiantity
  let orderPrice = 0;

  const orderProduct = [];

  for (const product of products) {
    const productExist = await Product.findById(product.productId); //{},null

    if (!productExist) return next(new AppError("product not found", 404));

    if (!productExist.inStock(product.quantity))
      return next(new AppError("out of stock", 400));
    productExist.stock -= product.quantity;
    await productExist.save();

    orderPrice += productExist.finalPrice * product.quantity;

    orderProduct.push({
      productId: productExist._id,

      price: productExist.price,

      finalPrice: productExist.finalPrice,

      quantity: product.quantity,

      discount: productExist.discount,
    });
  }
  let orderFinalPrice = "";
  if (coupon) {
    couponExist.couponType == coupunStatus.FIXEDAMOUNT
      ? (orderFinalPrice = orderPrice - couponExist.discount)
      : (orderFinalPrice =
          orderPrice - orderPrice * (couponExist.discount || 0 / 100));
  }
  //create order
  const order = new Order({
    user: req.user._id,
    address: { phone, street },
    coupon: {
      couponId: couponExist._id,
      code: coupon,
      discount: couponExist.discount,
    },
    paymentMethod,
    products: orderProduct,
    orderPrice,
    orderFinalPrice,
  });
  //console.log(paymentMethod);
  //add to DB
  const createdOrder = await order.save();
  //integrate with payment gateWay
  let session = "";
  if (paymentMethod == "visa") {
    session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "egp",
            unit_amount: orderFinalPrice * 100,
            product_data: {
              name: req.user.name,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://www.google.com.eg",
      cancel_url: `https://docs.stripe.com/checkout/quickstart?canceled=true`,
      customer_email: req.user.email,
    });
  }
  cart.products = [];
  await cart.save();

  if (coupon) await couponExist.save();

  res.json({ message: "order created sucessfully..", createdOrder, session });
});
