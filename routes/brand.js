const express = require("express");
const router = express.Router();
const BrandValidator = require("../validators/brand");
const AuthController = require("../controllers/auth");
const {
  getBrand,
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  brandImageUploader,
  resizeImage,
} = require("../controllers/brand");
router
  .route("/")
  .get(getBrands)
  .post(
    AuthController.validateJWT,
    AuthController.authorizedTo("admin", "manager"),
    brandImageUploader,
    resizeImage,
    BrandValidator.createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(BrandValidator.getBrandValidator, getBrand)
  .patch(
    AuthController.validateJWT,
    AuthController.authorizedTo("admin", "manager"),
    brandImageUploader,
    resizeImage,
    BrandValidator.updateBrandValidator,
    updateBrand
  )
  .delete(
    AuthController.validateJWT,
    AuthController.authorizedTo("admin"),
    BrandValidator.deleteBrandValidator,
    deleteBrand
  );
module.exports = router;
