const express = require("express");
const router = express.Router();
const subCategoriesRoute = require("./subCategory");
const categoryValidator = require("../validators/category");
const AuthController = require("../controllers/auth");
const {
  getCategories,
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  categoryImageUploader,
  resizeImage,
} = require("../controllers/category");
router
  .route("/")
  .get(getCategories)
  .post(
    AuthController.validateJWT,
    AuthController.authorizedTo("admin", "manager"),
    categoryImageUploader,
    resizeImage,
    categoryValidator.createCategoryValidator,
    createCategory
  );
router.use("/:id/subcategories", subCategoriesRoute);
router
  .route("/:id")
  .get(categoryValidator.getCategoryValidator, getCategory)
  .patch(
    AuthController.validateJWT,
    AuthController.authorizedTo("admin", "manager"),
    categoryImageUploader,
    resizeImage,
    categoryValidator.updateCategoryValidator,
    updateCategory
  )
  .delete(
    AuthController.validateJWT,
    AuthController.authorizedTo("admin"),
    categoryValidator.deleteCategoryValidator,
    deleteCategory
  );
module.exports = router;
