import slugify from "slugify";
import { Brand } from "../../../DB/models/brand.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { SubCategory } from "../../../DB/models/subCategory.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import cloudinary from "../../utils/cloudinary.js";
import { message } from "../../utils/constants/msgs.js";
import { Review } from "../../../DB/models/review.model.js";

export const addProduct = catchError(async (req, res, next) => {
  //get data from req
  let {
    name,
    slug,
    descriprion,
    category,
    subCategory,
    brand,
    price,
    discount,
    colors,
    size,
    stock,
    rate,
  } = req.body;
  console.log("brand id : ", brand);
  //check existance
  const brandExist = await Brand.findOne({ _id: brand }); //{},null
  slug = slugify(name);

  if (!brandExist) return next(new AppError("brand not found", 404));

  const subcategory = await SubCategory.findOne({ _id: subCategory }); //{},null
  console.log(subCategory);

  if (!subcategory) return next(new AppError("subcategory not found", 404));

  //uploads
  let failImages = [];
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    { folder: "product/mainImage" }
  );
  req.body.mainImage = { secure_url, public_id };
  failImages.push(public_id);
  const subImagesArr = [];
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: "product/subImages" }
    );
    subImagesArr.push({ secure_url, public_id });
    failImages.push(public_id);
  }

  //add to DB
  const product = new Product({
    name,
    slug: slugify(name),
    descriprion,
    category,
    subCategory,
    brand,
    price,
    discount,
    // colors: JSON.parse(colors),
    // size: JSON.parse(size),
    stock,
    rate,
    mainImage: req.body.mainImage,
    subImages: subImagesArr,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });
  const createdProduct = await product.save();
  if (!createdProduct) {
    //rollBack
    req.failImages = failImages;
    return next(new AppError("fail to create"));
  }

  res.json({ messgae: "sucess", createdProduct });
});

//get product

export const getProduct = catchError(async (req, res, next) => {
  //get data from req

  const { id } = req.params;
  const product = await Product.finFdById(id);
  if (!product) return next(new AppError("this product not found"));
  res.json({ message: "sucess", product });
});

//get all products

export const getAllProducts = catchError(async (req, res, next) => {
  let { page, limit, sort, select, ...fillter } = req.query;
  fillter = JSON.parse(
    JSON.stringify(fillter).replace(/gt|gte|lt|lte/g, (match) => `$${match}`)
  );
  // const excludedFields = ['page','size','sort','select']
  // const fillter = {...req.query}

  // excludedFields.forEach((ele)=>{
  //     delete fillter[ele]

  // })

  if (!page || page <= 0) {
    page = 1;
  }
  if (!limit || limit <= 0) {
    limit = 3;
  }
  limit = parseInt(limit);
  page = parseInt(page);

  sort = sort?.replaceAll(",", " ");
  select = select?.replaceAll(",", " ");
  const skip = (page - 1) * limit;
  const product = await Product.find(fillter)
    .limit(limit)
    .skip(skip)
    .sort(sort)
    .select(select)
    .lean();
  if (!product) return next(new AppError("this product not found"));
  res.json({
    message: "sucess",
    product,
    metaData: { page, limit, nextPage: page + 1 },
  });
});

//delete Product
export const deleteProduct = catchError(async (req, res, next) => {
  //get data from req
  const { id } = req.params;
  //check product existance
  const productExist = await Product.findByIdAndDelete(id); //null,{}
  if(!productExist)
    return next(new AppError(message.product.notFound))
  //delte the product images 

  await cloudinary.uploader.destroy(productExist.mainImage.public_id)
  for (const image of productExist.subImages) {
    await cloudinary.uploader.destroy(image.public_id)
  }
  res.json({message :message.product.sucess,productExist})
});
//todo make api that calculate all product reviews or avg review

export const productRate =catchError(async(req,res,next)=>{
//get data from req
const{id}=req.params;
//check product existance
const productExist = await Product.findById(id);
if(!productExist)
  return next(new AppError(message.product.notFound))

//get all rates of this product 
const reviews = await Review.find({ product:id})//{},null
if(!reviews)
  return next(new AppError('this product has no rates and review',400))
 // Calculate the sum of all ratings
 const sum = reviews.reduce((acc, review) => acc + review.rate, 0);
let avg=sum/reviews.length;
res.json({message:message.product.sucess,avg})
})