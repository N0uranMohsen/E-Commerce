import { User } from "../../../DB/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { message } from "../../utils/constants/msgs.js";

//add to wishlis
export const addToWishlist = catchError(async (req, res, next) => {
  //get data from req
  const { productId } = req.body;
  //add product to the wishlist
  const wishlist = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: { productId } } },
    { new: true }
  );

  return res.json({
    message: `product ${productId} added sucessfully to wihlish`,
    wishlist,
  });
});

//get logged user wishlist
export const getWishlist = catchError(async (req, res, next) => {
  //get data from req

  const user = await User.findById(req.user._id, { wishlist: 1 });

  return res.json(user);
});

//delete product from wishlist

export const deleteFromWishList = catchError(async (req, res, next) => {
  //get data from req
  const { productId } = req.params;
  
 const wishlist=  await User.findByIdAndUpdate(req.user._id,{$pull:{wishlist:productId}}).select('wishlist')

  res.json({message:'product removed sucessfully..',wishlist})

});
