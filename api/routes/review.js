const express = require("express");
const router = express.Router({ mergeParams: true });
const AuthController = require("../controllers/auth");
const ReviewValidator = require("../validators/review");
const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  AppendProductIdToBody,
  AppendUserIdToBody,
} = require("../controllers/review");
router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    AuthController.validateJWT,
    AuthController.authorizedTo("user"),
    AppendProductIdToBody,
    AppendUserIdToBody,
    ReviewValidator.createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReview)
  .patch(
    AuthController.validateJWT,
    AuthController.authorizedTo("user"),
    ReviewValidator.updateReviewValidator,
    updateReview
  )
  .delete(
    AuthController.validateJWT,
    AuthController.authorizedTo("user", "admin", "manager"),
    ReviewValidator.deleteReviewValidator,
    deleteReview
  );
module.exports = router;
