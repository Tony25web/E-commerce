const Brand = require("../models/brand");
const Factory = require("./handlerFactory");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImage");
const brandImageUploader = uploadSingleImage("image");
const asyncHandler = require("express-async-handler");
//image processing
const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);
  req.body.image = filename;
  next();
});
//@ fetching all brands
//@route GET /api/v1/brands
//@access Public

const getBrands = Factory.getAll(Brand, "Brand");

//@ fetching specific brand
//@route GET /api/v1/brands/:brandId
//@access Public

const getBrand = Factory.getOne(Brand, "Brand");

//@desc create a brand
//@route POST /api/v1/brands/create
//@access Private(admin)

const createBrand = Factory.createOne(Brand, "Brand");

//@desc update a brand
//@route PATCH /api/v1/brands/:brandId
//@access Private(admin)
const updateBrand = Factory.updateOne(Brand, "Brand");

//@desc delete a brand
//@route DELETE /api/v1/brands/:brandId
//@access Private(admin)

const deleteBrand = Factory.deleteOne(Brand, "Brand");

module.exports = {
  deleteBrand,
  updateBrand,
  createBrand,
  getBrand,
  getBrands,
  brandImageUploader,
  resizeImage,
};
