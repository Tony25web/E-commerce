const { check, body } = require("express-validator");
const { validator } = require("../middlewares/validator");
const slugify = require("slugify");
exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  validator,
];
exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category name is required")
    .isLength({ min: 3 })
    .withMessage(" name is too short ")
    .isLength({ max: 35 })
    .withMessage(" name is too long ")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validator,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  validator,
];
