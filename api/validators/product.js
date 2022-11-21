const { check } = require("express-validator");
const { validator } = require("../middlewares/validator");
const Category = require("../models/category");
const slugify = require("slugify");
const mongoose = require("mongoose");
const subCategory = require("../models/subCategory");
const { ApiError } = require("../utils/ApiError");
const createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("the title must be at least 3 characters")
    .notEmpty()
    .withMessage("the title must not be empty")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("the description must not be empty")
    .isLength({ max: 2000 })
    .withMessage("too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("the quantity is required")
    .isNumeric()
    .withMessage("quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("the price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("price is too long"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .toFloat()
    .withMessage("product price after discount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new ApiError(
          "the price after discount must be lower than the real price"
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("color must be an array of colors"),
  check("imageCover")
    .notEmpty()
    .withMessage("the product must have a least one image as cover"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images must be an array of images"),
  check("category")
    .notEmpty()
    .withMessage("the product must belong to a category")
    .isMongoId()
    .withMessage("invalid id format")
    .custom(async (category) => {
      const CateGory = await Category.findById(category);
      if (!CateGory) {
        return Promise.reject(
          new ApiError("this category does not exist try another one", 404)
        );
      }
      return true;
    }),
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("invalid id format")
    .custom(async (subcategoryId) => {
      await subCategory
        .find({
          _id: { $exists: true, $in: subcategoryId },
        })
        .then((subCategory) => {
          if (
            subCategory.length < 1 ||
            subCategory.length !== subcategoryId.length
          ) {
            return Promise.reject(
              new ApiError("this sub category does not exist ")
            );
          }
        });
      return true;
    })
    .custom((val, { req }) => {
      subCategory
        .find({ category: req.body.category })
        .then((subCategories) => {
          let subCategoriesIDsInDb = [];
          subCategories.forEach((subCategory) => {
            subCategoriesIDsInDb.push(subCategory._id.toString());
          });
          if (!val.every((v) => subCategoriesIDsInDb.includes(v))) {
            return Promise.reject(
              new ApiError(
                "not all sub categories do belong to a category,there is a sub Category id is invalid "
              )
            );
          }
        });
      let objectIdArray = req.body.subCategory.map((s) =>
        mongoose.Types.ObjectId(s)
      );
      return objectIdArray;
    }),
  check("brand").optional().isMongoId().withMessage("invalid id format"),
  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("rating Average must be a number")
    .isLength({ min: 1 })
    .withMessage("rating Average must equals to 1 or higher")
    .isLength({ max: 5 })
    .withMessage("rating Average must equals to 5 or lower"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("rating Quantity must be a number"),
  validator,
];
const getProductValidator = [
  check("id").isMongoId().withMessage("productId must be a valid id format"),
  validator,
];
const updateProductValidator = [
  check("id").isMongoId().withMessage("productId must be a valid id format"),
  check("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
  }),
  validator,
];
const deleteProductValidator = [
  check("id").isMongoId().withMessage("productId must be a valid id format"),
  validator,
];
module.exports = {
  getProductValidator,
  createProductValidator,
  deleteProductValidator,
  updateProductValidator,
};
