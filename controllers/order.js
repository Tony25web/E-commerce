const asyncHandler = require("express-async-handler");
const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const stripe = require("stripe")(
  "sk_test_51LpAiYFzr1SYnQSLqBNjrxbkbbY674DQMAEvDD0JM8J6caLJFTIo2Fm7UMDspBe3OmD19PW8JqlBr18VyrlVLOdw00yXpqk1fT"
);
const Factory = require("./handlerFactory");
const { ApiError } = require("../utils/ApiError");
// description create cash order
// route POST /api/v1/orders/:cartId
// access protected/User
const createCashOrder = asyncHandler(async (req, res, next) => {
  /*
  1) get the cart which depends on the cart id.
  2) get order price from cart price which it depends on that there is a coupon or not.
  3) Create order with default paymentMethod "cash".
  4) after creating an order we must update the product's quantity by decrement it in the stock and 
  the number of times it was sold by increment the sold property.
  5) clear the cart depend on the cart id   
   */
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1)
  const cart = await Cart.findOne({ _id: req.params.cartId });
  if (!cart) {
    throw new ApiError("there is no cart with id " + req.params.cartId, 404);
  }
  // 2)
  // order price= cartPrice+taxPrice+shippingPrice
  let orderPrice = cart?.totalPriceAfterDiscount || cart.totalPrice;
  let totalOrderPrice = orderPrice + taxPrice + shippingPrice;
  // 3)
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  // 4)
  if (order) {
    const BulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: {
          _id: item.product,
        },
        update: {
          $inc: {
            quantity: -item.quantity,
            sold: +item.quantity,
          },
        },
      },
    }));
    await Product.bulkWrite(BulkOption, {});
    //5)
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({ data: order, status: "success" });
});

const filterObjectForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.objFilter = { user: req.user._id };
  }
  next();
});
// description get All  orders
// route POST /api/v1/orders
// access protected/User-Admin-Manager
const getAllOrders = Factory.getAll(Order, "Order");
// description find a specific order
// route POST /api/v1/orders/:orderId
// access protected/User-Admin-Manager
const findASpecificOrder = Factory.getOne(Order, "Order");

// description update Order isDelivered status to delivered(true)
// route PUT /api/v1/orders/:orderId/deliver
// access protected/Admin-Manager
const updateOrderStatusIsDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (!order) {
    throw new ApiError(`Order not found with this id ${req.user._id}`, 404);
  }
  //update order to paid status
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const UpdatedOrder = await order.save();
  res.status(200).json({ data: UpdatedOrder, status: "success" });
});
// description update Order isPaid status to Paid(true)
// route PUT /api/v1/orders/:orderId/pay
// access protected/Admin-Manager
const updateOrderStatusIsPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (!order) {
    throw new ApiError(`Order not found with this id ${req.user._id}`, 404);
  }
  //update order to paid status
  order.isPaid = true;
  order.paidAt = Date.now();
  const UpdatedOrder = await order.save();
  res.status(200).json({ data: UpdatedOrder, status: "success" });
});
// description Get the checkout session from the stripe and then send it in the response
// route GET /api/v1/orders/checkoutSession/cartId
// access protected/User
const GetCheckoutSession = asyncHandler(async (req, res, next) => {
  /*  1) get the cart which depends on the cart id.
     2) get order price from cart price which it depends on that there is a coupon or not
     3) Create the Stripe Checkout Session 
     4) send the session in the response
  */
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1)
  const cart = await Cart.findOne({ _id: req.params.cartId });
  if (!cart) {
    throw new ApiError("there is no cart with id " + req.params.cartId, 404);
  }
  // 2)
  // order price= cartPrice+taxPrice+shippingPrice
  let orderPrice = cart?.totalPriceAfterDiscount || cart.totalPrice;
  let totalOrderPrice = orderPrice + taxPrice + shippingPrice;
  // 3)
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
          currency: "usd",
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: cart._id,
    metadata: req.user.shippingAddress,
  });
  //4)
  res.status(200).json({ status: "success", StripeSession: session });
});
module.exports = {
  getAllOrders,
  findASpecificOrder,
  filterObjectForLoggedUser,
  createCashOrder,
  updateOrderStatusIsPaid,
  updateOrderStatusIsDelivered,
  GetCheckoutSession,
};
