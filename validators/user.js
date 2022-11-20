const { check, body } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validator } = require("../middlewares/validator");
const slugify = require("slugify");
exports.getUserValidator = [
  check("id").isMongoId().withMessage("invalid User id"),
  validator,
];
exports.createUserValidator = [
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
  check("profileImage").optional(),
  check("role").optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-SY", "ar-LB", "ar-EG"])
    .withMessage("invalid phone number only valid from :egypt syria lebanon "),
  validator,
];
exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid User id"),
  body("name")
    .optional()
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
  check("profileImage").optional(),
  check("role").optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-SY", "ar-LB", "ar-EG"])
    .withMessage("invalid phone number only valid from :egypt syria lebanon "),
  validator,
];
exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("invalid User id"),
  body("currentPassword")
    .notEmpty()
    .withMessage("Please enter your current password"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Please retype your next password"),
  body("password")
    .notEmpty()
    .withMessage("Please enter your next password")
    .custom(async (val, { req }) => {
      //1-check if the current password does exist
      //2- check if the password identical with confirm password
      const user = await User.findOne({ _id: req.params.id });
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("incorrect current password try again ");
      }
      if (val !== req.body.confirmPassword) {
        throw new Error("incorrect password confirmation try again ");
      }
      return true;
    }),
  validator,
];
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid User id"),
  validator,
];
exports.changeLoggedUserData = [
  body("name")
    .optional()
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
  check("phone")
    .optional()
    .isMobilePhone(["ar-SY", "ar-LB", "ar-EG"])
    .withMessage("invalid phone number only valid from :egypt syria lebanon "),
  validator,
];
