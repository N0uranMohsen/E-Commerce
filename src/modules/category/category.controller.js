import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import { catchError } from "../../middleware/catchError.js";
import { message } from "../../utils/constants/msgs.js";
import { deleteCloud, deleteFile } from "../../utils/FileFunc.js";
import { SubCategory } from "../../../DB/models/subCategory.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { AppError } from "../../utils/appError.js";

export const addCategory = catchError(async (req, res, next) => {
  //get data fom req
  let { name } = req.body;
  name = name.toLowerCase();

  if (!req.file) return next(new AppError("file is required", 400));

  //checl catgeory existance

  const find = await Category.findOne({ name }); //{},null

  if (find) return next(new AppError(message.category.alreadyExist, 409));

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "category" }
  );
  const slug = slugify(name);
  req.body.image = { secure_url, public_id };
  const category = new Category({
    name,
    slug,
    image: req.body.image,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });
  await category.save(); //{},null

  if (!category) {
    //role back delete
    req.failImage = public_id;
    return next(new AppError(message.category.failToCreate, 500));
  }

  res.status(201).json({ message: "created successfully", category });
});

//update category
export const updateCategory = catchError(async (req, res, next) => {
  //get data from req

  const { name } = req.body;
  const { id } = req.params;

  const findCategory = await Category.findById(id);

  if (!findCategory) {
    return next(new AppError("not found", 404));
  }

  //check name existance
  const findName = await Category.findOne({ name, _id: { $ne: id } });

  if (findName) return next(new AppError("this name is aleady is exists", 409));

  //prepare data
  if (name) {
    findCategory.slug = slugify(name);
    findCategory.name = name;
  }

  //update image

  let failImages = [];

  if (req.file) {
    deleteCloud(findCategory.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "category" }
    );

    failImages.push(public_id);

    findCategory.image = { secure_url, public_id };
    // findCategory.image.path = req.file.path;
    // findCategory.markModified("image");
  }

  //const updatedCategory = await Category.finByIdAndUpdate(id,image:{path:req.file.path},{new:true})
  const category = await findCategory.save();

  if (!category) {
    req.failImages = failImages;
    return next(new AppError("fail to update"));
  }
  res.json({ messgae: "sucess", category });
});

//get All Categories with sub categories

export const getCategories = catchError(async (req, res, next) => {
  const category = await Category.find().populate("subCategories");
  if (!category) return next(new AppError("there is no catgeories", 404));
  res.json({ messgae: "sucess", category });
});
// export const getCategories = catchError(async(req,res,next)=>{

//     const category = await Category.aggregate({
//         $lookup :{
//             from:'subcategories',
//             localfiels : "_id",
//             foriegn :"category",

//         }
//     })
//     if(!category)
//         return next(new AppError ('there is no catgeories',404))
//     res.json({messgae :'sucess',category })

//})

//delete Category & Related Images , SubCategories and Products

//delte Category
export const deleteCategory = catchError(async (req, res, next) => {
  //get data from req

  const { id } = req.params;

  //check existance-and-delete

  const catgeoryExist = await Category.findByIdAndDelete(id).populate([
    { path: "subCategories", select: "image" },
    { path: "products", select: "mainImage subImages" },
  ]); //{},null

  if (!catgeoryExist) return next(new AppError("category not found", 404));

  //prepare Ids
  const subCategoriesIds = [];
  const productIds = [];
  const imagesPaths = [];
  const imagesCloudProduct = [];
  imagesPaths.push(catgeoryExist.image.path);

  for (let i = 0; i < catgeoryExist.subCategories; i++) {
    subCategoriesIds.push(catgeoryExist.subCategories[i]._id);
    imagesPaths.push(catgeoryExist.subCategories[i].image);
  }

  for (const product of catgeoryExist.products) {
    productIds.push(product._id);
    imagesCloudProduct.push(product.mainImage.public_id);
    product.subImages.forEach((image) => {
      imagesCloudProduct.push(image.public_id);
    });
  }

  //remove related subCategories and cat & products
  await SubCategory.deleteMany({ _id: { $in: subCategoriesIds } });
  await Product.deleteMany({ _id: { $in: productIds } });

  //delte image catgery & subCat
  for (const path of imagesPaths) {
    deleteFile(path);
  }
  //delete images from products

  for (const public_id of imagesCloudProduct) {
    await cloudinary.uploader.destroy(public_id);
    // await cloudinary.api.delete_resources_by_prefix();
  }

  res.json({ message: "deleted Sucesfully..!" });
});
