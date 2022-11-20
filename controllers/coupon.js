const Coupon = require("../models/coupon");
const Factory = require("./handlerFactory");
//@ fetching all Coupon
//@route GET /api/v1/Coupon
//@access Private(admin/manager)

const getCoupons = Factory.getAll(Coupon, "Coupon");

//@ fetching specific Coupon
//@route GET /api/v1/Coupon/:couponId
//@access Private(admin/manager)

const getCoupon = Factory.getOne(Coupon, "Coupon");

//@desc create a Coupon
//@route POST /api/v1/Coupon/create
//@access Private(admin/manager)

const createCoupon = Factory.createOne(Coupon, "Coupon");

//@desc update a Coupon
//@route PATCH /api/v1/Coupon/:brandId
//@access Private(admin/manager)
const updateCoupon = Factory.updateOne(Coupon, "Coupon");

//@desc delete a brand
//@route DELETE /api/v1/Coupon/:couponId
//@access Private(admin/manager)

const deleteCoupon = Factory.deleteOne(Coupon, "Coupon");

module.exports = {
  deleteCoupon,
  updateCoupon,
  createCoupon,
  getCoupon,
  getCoupons,
};
