const { check, body } = require("express-validator");
const { validator } = require("../middlewares/validator");
const Review = require("../models/review");
exports.getReviewValidator = [
  check("id").isMongoId().withMessage("invalid Review id"),
  validator,
];
exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),
  check("user").isMongoId().withMessage("invalid user id"),
  check("product")
    .isMongoId()
    .withMessage("invalid product id")
    .custom(async (val, { req }) => {
      // check if the user created a review on this product already or not
      const review = await Review.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (review) {
        return Promise.reject(
          new Error("you already have a review on this product")
        );
      }
      return true;
    }),
  validator,
];
exports.updateReviewValidator = [
  // check if the review does belong to this user or not
  check("id")
    .isMongoId()
    .withMessage("invalid user id")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        return Promise.reject(
          new Error(`there is not review with this id ${val}`)
        );
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new Error("you can't modify a review that does not belongs to you ")
        );
      }
      return true;
    }),
  validator,
];
exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id")
    .custom(async (val, { req }) => {
      if (req.user.role === "user") {
        const review = await Review.findById(val);
        if (!review) {
          return Promise.reject(
            new Error(`there is not review with this id ${val}`)
          );
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("you can't modify a review that does not belongs to you ")
          );
        }
        return true;
      }
    }),

  validator,
];
