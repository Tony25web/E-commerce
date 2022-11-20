const User = require("../models/user");
const asyncHandler = require("express-async-handler");

//@ add a product to a User's wishList
//@route POST /api/v1/Addresses/AddAddress
//@access Public
const AddUserAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: { ...req.body } },
    },
    { new: true }
  );
  res.status(201).json({
    status: "success",
    message: "address added successfully",
  });
});
//@ add a product to a User's wishList
//@route DELETE /api/v1/user/Addresses/:addressId
//@access Public
const RemoveAddressFromUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(201).json({
    status: "success",
    message: "Address removed successfully",
  });
});
//@ add a product to a User's wishList
//@route GET /api/v1/Addresses/:addressId
//@access Public
const GetUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    productsNumber: user.addresses.length,
    status: "success",
    data: user.addresses,
  });
});
module.exports = {
  AddUserAddress,
  RemoveAddressFromUser,
  GetUserAddresses,
};
