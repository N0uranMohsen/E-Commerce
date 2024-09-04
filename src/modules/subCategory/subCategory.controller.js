import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import { SubCategory } from "../../../DB/models/subCategory.model.js";
import { catchError } from "../../middleware/catchError.js";

import { deleteCloud } from "../../utils/FileFunc.js";
import cloudinary from "../../utils/cloudinary.js";
import { AppError } from "../../utils/appError.js";
import { Product } from "../../../DB/models/product.model.js";

export const addSubCategory = catchError(async (req, res, next) => {
  //get data from req
  const { name, category } = req.body;

  //check file
  if (!req.file) return next(new AppError("must add image", 404));

  //check Category exit
  const categoryExist = await Category.findById(category);
  if (!categoryExist) return next(new AppError("category not found", 404));

  //check name existance
  const nameExist = await SubCategory.findOne({ name, category });

  if (nameExist)
    return next(new AppError("this name od sub category is aleady exist", 404));
  let failImages = [];
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "subCategories" }
  );
  //repeare data
  failImages.push(public_id);
  const slug = slugify(name);

  const subcategory = new SubCategory({
    name,
    slug,
    category,
    image: { secure_url, public_id },
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });
  await subcategory.save();
  if (!subcategory) {
    req.failImages = failImages;
    return next(new AppError("fail to create"), 404);
  }

  res.status(201).json({ message: "sucess", subcategory });
});

//get all subCategories
export const getSubCategories = catchError(async (req, res, next) => {
  //get data from req

  const { id } = req.params;

  //check catgeory existance
  const subCategories = await SubCategory.find({ category: id }).populate(
    "category"
  );
  if (subCategories.length <= 0)
    return next(new AppError("no sub categoreis found", 404));
  res.json({ message: "sucess", subCategories });
});
//update SubCategory

export const updateSubCategory = catchError(async (req, res, next) => {
  //get data from req
  const { id } = req.params;
  let { name } = req.body;
  if (name) name = name.toLowerCase();

  //check subcategory exitsns

  const subCategoryExist = await SubCategory.findById(id);
  if (!subCategoryExist)
    return next(new AppError("this subCategory is not exist", 404));

  //check name existnace
  if (name) {
    const nameExist = await SubCategory.findOne({ name, _id: { $ne: id } });
    if (nameExist)
      return next(new AppError("this name is aleardy exist...", 409));
    subCategoryExist.name = name;
    subCategoryExist.slug = slugify(name);
  }

  let failImages;
  if (req.file) {
    deleteCloud(subCategoryExist.image.public_id);

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "Subcategories" }
    );
    subCategoryExist.image = { secure_url, public_id };
    failImages = public_id;
  }

  const subCategory = await subCategoryExist.save();
  if (!subCategory) {
    req.failImages = failImages;
    return next(new AppError("fail to update subcategory"));
  }
});
//Delete SubCategory

export const deleteSubCategory = catchError(async (req, res, next) => {
  //get Data from req

  const { id } = req.params;

  //check existance
  const subCategoryExist = await SubCategory.findByIdAndDelete(id).populate([
    { path: "products", select: "Image subImages" },
  ]); //{},null

  if (!subCategoryExist)
    return next(new AppError("this subcategory not found...", 409));
  await cloudinary.uploader.destroy(subCategoryExist.image.public_id);
  const productIds = [];
  const imagesCloudProduct = [];

  for (const product of subCategoryExist.products) {
    productIds.push(product._id);
    imagesCloudProduct.push(product.mainImage.public_id);
    product.subImages.forEach((image) => {
      imagesCloudProduct.push(image.public_id);
    });
  }
  //dlete all related products
  await Product.deleteMany({ _id: { $in: productIds } });

  //delete products images from cloud
  for (const public_id of imagesCloudProduct) {
    await cloudinary.uploader.destroy(public_id);
  }

  res.json({ messages: "deleted sucssfully..." });
});
