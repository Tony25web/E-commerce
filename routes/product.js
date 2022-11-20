const express = require("express");
const router = express.Router();
const ProductValidator = require("../validators/product");
const AuthController = require("../controllers/auth");
const reviewRoutes = require("./review");
const {
  getProduct,
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  resizeProductImages,
  uploadProductImages,
} = require("../controllers/product");
router.route("/").get(getProducts);
router
  .route("/create")
  .post(
    AuthController.validateJWT,
    AuthController.authorizedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    ProductValidator.createProductValidator,
    createProduct
  );
// GET BASE_URL/products/:productId/reviews
// GET BASE_URL/products/:productId/reviews/:reviewId
// POST BASE_URL/products/:productId/reviews
router.use("/:productId/reviews", reviewRoutes);
router
  .route("/:id")
  .get(ProductValidator.getProductValidator, getProduct)
  .patch(
    AuthController.validateJWT,
    AuthController.authorizedTo("admin", "manager"),
    ProductValidator.updateProductValidator,
    updateProduct
  )
  .delete(
    AuthController.validateJWT,
    AuthController.authorizedTo("admin"),
    ProductValidator.deleteProductValidator,
    deleteProduct
  );
module.exports = router;
