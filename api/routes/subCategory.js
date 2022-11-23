const express = require("express");
// mergeParams job is to preserve the parent route req.params so we can access it
const router = express.Router({ mergeParams: true });
const AuthController = require("../controllers/auth");
const subCategoryValidators = require("../validators/subCategory");
const {
  createSubCategory,
  getSubCategories,
  getASubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../controllers/subCategory");
router.route("/").get(createFilterObj, getSubCategories);
router
  .route("/create")
  .post(
    AuthController.validateJWT,
    AuthController.authorizedTo("admin", "manager"),
    setCategoryIdToBody,
    subCategoryValidators.createSubCategoryValidator,
    createSubCategory
  );
router
  .route("/:id")
  .get(subCategoryValidators.getASubCategoryValidator, getASubCategory)
  .patch(
    AuthController.validateJWT,
    AuthController.authorizedTo("admin", "manager"),
    subCategoryValidators.updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    AuthController.validateJWT,
    AuthController.authorizedTo("admin"),
    subCategoryValidators.deleteSubCategoryValidator,
    deleteSubCategory
  );
module.exports = router;
