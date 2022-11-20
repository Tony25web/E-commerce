const Review = require("../models/review");
const Factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
//@ fetching all reviews
//@route GET /api/v1/reviews
//@access Public

const getReviews = Factory.getAll(Review, "Review");

//@ fetching specific Review
//@route GET /api/v1/reviews/:id
//@access Public

const getReview = Factory.getOne(Review, "Review");

//@desc create a Review
//@route POST /api/v1/reviews/create
//@access Private/protect(user logged in)/role user

const createReview = Factory.createOne(Review, "Review");

//@desc update a Review
//@route PATCH /api/v1/reviews/:id
//@access Private/protect(user logged in)/role user
const updateReview = Factory.updateOne(Review, "Review");

//@desc delete a Review
//@route DELETE /api/v1/reviews/:id
//@access Private/protect(user logged in)/role user Admin Manager

const deleteReview = Factory.deleteOne(Review, "Review");
// for the nested route
const createFilterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.productId) {
    filterObj = { product: req.params.productId };
  }
  req.objFilter = filterObj;
  next();
};
const AppendProductIdToBody = (req, res, next) => {
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }

  next();
};
const AppendUserIdToBody = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

module.exports = {
  createFilterObj,
  deleteReview,
  updateReview,
  createReview,
  getReview,
  getReviews,
  AppendProductIdToBody,
  AppendUserIdToBody,
};
