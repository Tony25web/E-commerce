const Category = require("../models/category");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImage");
const Factory = require("./handlerFactory");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
//upload single image
const categoryImageUploader = uploadSingleImage("image");
//image processing
const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);
  req.body.image = filename;
  next();
});
//@ fetching all categories
//@route GET /api/v1/categories
//@access Public

const getCategories = Factory.getAll(Category, "Category");

//@ fetching specific category
//@route GET /api/v1/categories/:categoryId
//@access Public

const getCategory = Factory.getOne(Category, "Category");

//@desc create a category
//@route POST /api/v1/categories/
//@access Private(admin)

const createCategory = Factory.createOne(Category, "Category");

//@desc update a category
//@route PATCH /api/v1/categories/:categoryId
//@access Private(admin)

const updateCategory = Factory.updateOne(Category, "Category");

//@desc delete a category
//@route Delete /api/v1/categories/:categoryId
//@access Private(admin)

const deleteCategory = Factory.deleteOne(Category, "Category");

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  categoryImageUploader,
  resizeImage,
};
