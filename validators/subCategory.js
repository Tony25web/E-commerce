const { check } = require("express-validator");
const { validator } = require("../middlewares/validator");
const slugify = require("slugify");
exports.getASubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  validator,
];
exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category name is required")
    .isLength({ min: 2 })
    .withMessage(" name is too short ")
    .isLength({ max: 32 })
    .withMessage(" name is too long ")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("category is required")
    .isMongoId()
    .withMessage("must be a valid id of a category"),
  validator,
];
exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
  }),
  validator,
];
exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  validator,
];
