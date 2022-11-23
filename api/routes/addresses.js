const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const {
  AddUserAddress,
  RemoveAddressFromUser,
  GetUserAddresses,
} = require("../controllers/userAddresses");
router.use(authController.validateJWT, authController.authorizedTo("user"));
router.route("/").get(GetUserAddresses);
router.route("/create").post(AddUserAddress);
router.route("/delete/:addressId").delete(RemoveAddressFromUser);

module.exports = router;
