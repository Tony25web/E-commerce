const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "coupon name is required"],
      unique: true,
    },
    couponExpiration: {
      type: Date,
      required: [true, "coupon expiration Date is required"],
    },
    discount: { type: Number, required: [true, "discount value is required"] },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Coupon", couponSchema);
