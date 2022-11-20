const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "a user must have an email address"],
      lowercase: true,
    },
    phone: String,
    profileImage: String,
    password: {
      type: String,
      required: [true, "a user must have a password"],
      minLength: [8, "too short"],
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetCode: String,
    passwordResetCodeExpirationTime: String,
    passwordResetIsVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    // child reference (one to many relationship)
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: Number,
        city: String,
        postalCode: Number,
      },
    ],
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.pre(/^find/, function (next) {
  this.populate({ path: "wishlist" })?.populate({ path: "addresses" });
  next();
});
userSchema.methods.generateJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};
userSchema.methods.verifyJWT = function (password) {
  return JWT.verify(password, process.env.JWT_SECRET);
};
module.exports = mongoose.model("user", userSchema);
