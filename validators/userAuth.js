const { check } = require("express-validator");
const User = require("../models/user");
const { validator } = require("../middlewares/validator");
const slugify = require("slugify");
exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("User's name is required")
    .isLength({ min: 3 })
    .withMessage(" name is too short ")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("User's email is required")
    .isEmail()
    .withMessage("please provide us a valid email format")
    .custom(async (val, { req }) => {
      await User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("this email is already in use"));
        }
      });
    }),

  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error("password doesn't match try again");
      }
      return true;
    }),
  validator,
];
exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("User's email is required")
    .isEmail()
    .withMessage("please provide us a valid email format")
    .normalizeEmail(),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  validator,
];
