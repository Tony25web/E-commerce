const express = require("express");
const router = express.Router();
// const BrandValidator = require("../validators/brand");
const AuthController = require("../controllers/auth");
const {
  getCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/coupon");
router.use(
  AuthController.validateJWT,
  AuthController.authorizedTo("admin", "manager")
);
router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getCoupon).patch(updateCoupon).delete(deleteCoupon);
module.exports = router;
