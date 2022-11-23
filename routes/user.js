const express = require("express");
const router = express.Router();
const UserValidator = require("../validators/user");
const AuthController = require("../controllers/auth");
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  UserImageUploader,
  resizeImage,
  changePassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deactivateLoggedUser,
} = require("../controllers/user");
router.use(AuthController.validateJWT);
router.route("/getMe").get(getLoggedUserData, getUser);
router.route("/changeMyPassword").patch(updateLoggedUserPassword);
router
  .route("/updateMyData")
  .patch(UserValidator.changeLoggedUserData, updateLoggedUserData);
router.route("/deactivateUser").patch(deactivateLoggedUser);
router.route("/").get(AuthController.authorizedTo("admin"), getUsers);
router
  .route("/create")
  .post(
    AuthController.authorizedTo("admin"),
    UserImageUploader,
    resizeImage,
    UserValidator.createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(
    AuthController.authorizedTo("admin"),
    UserValidator.getUserValidator,
    getUser
  )
  .patch(
    AuthController.authorizedTo("admin"),
    UserImageUploader,
    resizeImage,
    UserValidator.updateUserValidator,
    updateUser
  )
  .delete(
    AuthController.authorizedTo("admin"),
    UserValidator.deleteUserValidator,
    deleteUser
  );
router
  .route("/changepassword/:id")
  .patch(UserValidator.changeUserPasswordValidator, changePassword);
module.exports = router;
