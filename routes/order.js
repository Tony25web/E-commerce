const express = require("express");
const router = express.Router();
const {
  createCashOrder,
  getAllOrders,
  filterObjectForLoggedUser,
  findASpecificOrder,
  updateOrderStatusIsPaid,
  updateOrderStatusIsDelivered,
  GetCheckoutSession,
} = require("../controllers/order");
const AuthController = require("../controllers/auth");
router.use(AuthController.validateJWT);
router
  .route("/:cartId")
  .post(AuthController.authorizedTo("user"), createCashOrder);
router
  .route("/")
  .get(
    AuthController.authorizedTo("user", "admin", "manager"),
    filterObjectForLoggedUser,
    getAllOrders
  );
router.route("/:id").get(findASpecificOrder);
router
  .route("/:id/pay")
  .put(
    AuthController.authorizedTo("admin", "manager"),
    updateOrderStatusIsPaid
  );
router
  .route("/:id/deliver")
  .put(
    AuthController.authorizedTo("admin", "manager"),
    updateOrderStatusIsDelivered
  );
router
  .route("/checkoutSession/:cartId")
  .get(AuthController.authorizedTo("user"), GetCheckoutSession);
module.exports = router;
