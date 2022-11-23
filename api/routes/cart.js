const express = require("express");
const router = express.Router();
// const BrandValidator = require("../validators/brand");
const AuthController = require("../controllers/auth");
const {
  addProductToCart,
  getLoggedUserCart,
  removeItemFromCart,
  DeleteUserCart,
  updateCateItemQuantity,
  applyCouponsOnProduct,
} = require("../controllers/Cart");
router.use(AuthController.validateJWT, AuthController.authorizedTo("user"));
router.route("/applyCoupon").put(applyCouponsOnProduct);
router
  .route("/")
  .get(getLoggedUserCart)
  .post(addProductToCart)
  .delete(DeleteUserCart);
router.route("/:id").patch(removeItemFromCart).put(updateCateItemQuantity);
module.exports = router;
