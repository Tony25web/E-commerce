const { check, body } = require("express-validator");
const { validator } = require("../middlewares/validator");
const slugify = require("slugify");
exports.getBrandValidator = [
  check("id").isMongoId().withMessage("invalid brand id"),
  validator,
];
exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
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
exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid brand id"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator,
];
exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalid brand id"),
  validator,
];
