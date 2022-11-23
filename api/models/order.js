const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "a user is required for this action"],
    },
    cartItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    taxPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    totalOrderPrice: { type: Number },
    paymentMethod: { type: String, enum: ["card", "cash"], default: "cash" },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);
orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name -wishlist -addresses" }).populate(
    {
      path: "cartItems.product",
      select: "name",
    }
  );
  next();
});
module.exports = mongoose.model("Order", orderSchema);
