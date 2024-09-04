import slugify from "slugify";
import { Brand } from "../../../DB/models/brand.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";
import cloudinary from "../../utils/cloudinary.js";
import { message } from "../../utils/constants/msgs.js";

export const addBrand = catchError(async (req, res, next) => {
  //get datta from req

  let { name } = req.body;
  name = name.toLowerCase();
  //check image
  if (!req.file) return next(new AppError("logo is required", 404));
  //check existance
  const brandExist = await Brand.findOne({ name }); //{},null
  if (brandExist) return next(new AppError("this brand is aleady exist", 409));

  //prepare data
  const slug = slugify(name);
  //upload pic on cloud
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: "logo/brand" }
  );

  const brand = new Brand({
    name,
    slug,
    logo: { secure_url, public_id },
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });
  //add to DB
  const createdBrand = await brand.save();
  if (!createdBrand) {
    await cloudinary.uploader.destroy(req.file.public_id);
    return next(new AppError("fail to create in DB"));
  }

  res.json({ message: "created Successfully..!", createdBrand });
});

//updtae brand

export const updateBrand = catchError(async (req, res, next) => {
  //get data from req

  let { name } = req.body;
  // name = name.toLowerCase()
  const { id } = req.params;
  //check brand existance

  const brandExist = await Brand.findById(id);
  if (!brandExist) return next(new AppError("this brand nor exist")); //{},null
  //checl name Exist
  if (name) {
    const nameExist = await Brand.findOne({ name, _id: { $ne: id } });
    if (nameExist) return next(new AppError("this name is aleady exist", 404));
    brandExist.name = name;
    brandExist.slug = slugify(name);
  }
  //check logo
  if (req.file) {
    //remove old image
    // await cloudinary.uploader.destroy(brandExist.logo.public_id)
    //upload new image
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { puplic_id: brandExist.logo.public_id }
    );
    brandExist.logo = { secure_url, public_id };
  }

  //update to DB
  const updatedBrand = await brandExist.save();
  if (!updatedBrand) {
    //roleback
    await cloudinary.uploader.destroy(public_id);
    return next(new AppError("fail to update brand", 500));
  }

  res.json({ message: "updated Sucssefully..!", updatedBrand });
});

//get brand
export const getBrand = catchError(async (req, res, next) => {
  //get data from req
  const { id } = req.params;
  //checl brand exist
  const brandExist = await Brand.findById(id);
  if (!brandExist) return next(new AppError(message.brand.notFound, 404));
  res.status(200).json({ message: message.brand.sucess, brandExist });
});

//delete Brand
export const deleteBrand = catchError(async (req, res, next) => {
  const { id } = req.params;
  //check brand existance

  const brandExist = await Brand.findByIdAndDelete(id);
  if (!brandExist) return next(new AppError("this brand nor exist")); //{},null
  const delteLogo = await cloudinary.uploader.destroy(
    brandExist.logo.public_id
  );
  if (!delteLogo) return next(new AppError("fail to delte brand logo", 404));
});
