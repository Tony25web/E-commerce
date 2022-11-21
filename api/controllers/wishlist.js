const { ApiError } = require("../utils/ApiError");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

//@ add a product to a User's wishList
//@route POST /api/v1/wishlist
//@access Public
const AddProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(201).json({
    status: "success",
    data: user.wishlist,
    message: "added to the wishlist",
  });
});
const RemoveAWishlistFromProduct = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(201).json({
    status: "success",
    message: "removed to the wishlist",
  });
});
const GetUserWishlistProducts = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res
    .status(200)
    .json({
      productsNumber: user.wishlist.length,
      status: "success",
      data: user,
    });
});
module.exports = {
  AddProductToWishlist,
  RemoveAWishlistFromProduct,
  GetUserWishlistProducts,
};
