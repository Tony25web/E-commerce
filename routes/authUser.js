const express = require("express");
const router = express.Router();
const UserAuthValidator = require("../validators/userAuth");
const {
  signUp,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} = require("../controllers/auth");
router.route("/signup").post(UserAuthValidator.signUpValidator, signUp);
router.route("/login").post(UserAuthValidator.loginValidator, login);
router.route("/forgetPassword").post(forgetPassword);
router.route("/verifyResetCode").post(verifyResetCode);
router.route("/resetPassword").post(resetPassword);
// router
//   .route("/:id")
//   .get(UserValidator.getUserValidator, getUser)
//   .patch(
//     UserImageUploader,
//     resizeImage,
//     UserValidator.updateUserValidator,
//     updateUser
//   )
//   .delete(UserValidator.deleteUserValidator, deleteUser);
// router
//   .route("/changepassword/:id")
//   .patch(UserValidator.changeUserPasswordValidator, changePassword);

module.exports = router;
