const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const {
  GetUserWishlistProducts,
  AddProductToWishlist,
  RemoveAWishlistFromProduct,
} = require("../controllers/wishlist");
router.use(authController.validateJWT, authController.authorizedTo("user"));
router.route("/").get(GetUserWishlistProducts);
router.route("/create").post(AddProductToWishlist);
router.route("/delete/:productId").delete(RemoveAWishlistFromProduct);

module.exports = router;
