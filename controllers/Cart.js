const asyncHandler = require("express-async-handler");
const { ApiError } = require("../utils/ApiError");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Product = require("../models/product");
const calculateTotalPrice = (cart) => {
  let total_price = 0;
  cart.cartItems.forEach((product) => {
    total_price += product.price * product.quantity;
  });
  cart.totalPrice = total_price;
  cart.totalPriceAfterDiscount = undefined;
  return total_price;
};
//@ add product to Cart
//@route POST /api/v1/cart
//@access Protected/user (logged USER)
const addProductToCart = asyncHandler(async (req, res, next) => {
  // 1) get the user's cart
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    // create a cart for the logged user with his products
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // if product exists in cart then update the quantity and push the product into the cartItems Property
    const productExists = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productExists != -1) {
      const cartItem = cart.cartItems[productExists];
      cartItem.quantity += 1;
      cart.cartItems[productExists] = cartItem;
    } else {
      // if product does not exist in cart then  push the product into the cartItems Property
      cart.cartItems.addToSet({
        product: productId,
        color,
        price: product.price,
      });
    }
  }
  calculateTotalPrice(cart);

  await cart.save();
  res.status(200).json({
    status: "success",
    message: "product added to cart successfully",
    data: cart,
  });
});
//@ get logged user Cart
//@route GET /api/v1/cart
//@access Protected/user (logged USER)
const getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const userCart = await Cart.findOne({ user: req.user._id });
  if (!userCart) {
    throw new ApiError("there is no cart for you", 404);
  }
  calculateTotalPrice(userCart);
  res.status(200).json({ status: "success", Cart: userCart });
});
//@ remove from a logged user Cart an item
//@route PATCH /api/v1/cart
//@access Protected/user (logged USER)
const removeItemFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError("there is no cart for you", 404);
  }
  cart.cartItems.pull({ _id: req.params.id });
  calculateTotalPrice(cart);
  await cart.save();
  res
    .status(200)
    .json({ message: "the item was deleted successfully from the cart" });
});
//@ remove a logged user Cart
//@route DELETE /api/v1/cart
//@access Protected/user (logged USER)
const DeleteUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).json({ status: "success", message: "deleted successfully" });
});
//@ update specific Cart item quantity
//@route PUT /api/v1/cart/:id
//@access Protected/user (logged USER)
const updateCateItemQuantity = asyncHandler(async (req, res, next) => {
  /*      
  another method to update the quantity of a product
  findOneAndUpdate(
    {user: req.user._id,cartItems: { $exists: true }},
    { $set: { "cartItems.$[el].quantity": req.body.quantity } },
    { new: true, arrayFilters: [{ "el._id": req.params.id }]
    })*/
  const cart = await Cart.findOneAndUpdate({ user: req.user._id });
  let cartIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.id
  );
  cart.cartItems[cartIndex].quantity = req.body.quantity;
  calculateTotalPrice(cart);
  await cart.save();
  res.status(200).json({ status: "success", cart });
});
//@ Apply a Coupon on A product that was added in the cart
//@route PUT /api/v1/cart/applyCoupon
//@access Protected/user (logged USER)
const applyCouponsOnProduct = asyncHandler(async (req, res, next) => {
  // 1) get the coupon name from body Object
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    couponExpiration: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(
      new ApiError(`No Coupon found with this name or this coupon is expired`)
    );
  }
  // 2) get logged user cart to get the total price before applying a coupon
  const cart = await Cart.findOne({ user: req.user._id });
  let totalProductsPrice = cart.totalPrice;
  //3) calculate the total price after applying the coupon
  const totalProductPriceAfterDiscount =
    totalProductsPrice - (totalProductsPrice * coupon.discount) / 100;
  cart.totalPriceAfterDiscount = totalProductPriceAfterDiscount.toFixed(2);
  await cart.save();
  res.status(200).json({
    status: "success",
    data: cart,
    numberOfItemsInCart: cart.cartItems.length,
  });
});

module.exports = {
  addProductToCart,
  applyCouponsOnProduct,
  getLoggedUserCart,
  removeItemFromCart,
  DeleteUserCart,
  updateCateItemQuantity,
};
