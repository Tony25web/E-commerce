const crypto = require("crypto");

const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//User authentication service like:reset password/forget password/signup/login/logout
const asyncHandler = require("express-async-handler");
const { ApiError } = require("../utils/ApiError");
const { sendEmail } = require("../utils/sendEmail");
require("dotenv").config();
const User = require("../models/user");
//@ sign up a user
//@route GET /api/v1/auth/signup
//@access Public

const signUp = asyncHandler(async (req, res, next) => {
  //1-create a user
  //2- generate JWT
  const user = await User.create({
    name: req.body.email,
    password: req.body.password,
    email: req.body.email,
  });
  const token = user.generateJWT();
  res.status(201).json({ data: user, jwtToken: token });
});

//@ sign up a user
//@route GET /api/v1/auth/login
//@access Public

const login = asyncHandler(async (req, res, next) => {
  // 1 check if email and password are correct
  // 2- check if the user exist and check if password is correct
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new ApiError("User not found", 404);
  }
  const IsCorrectPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!IsCorrectPassword) {
    throw new ApiError("password is incorrect", 404);
  }
  // 3- generate the token and send a response to the client side
  const token = user.generateJWT();
  res.status(200).json({ User: user, jwtToken: token });
});
// @desc make sure that the user is logged in
const validateJWT = asyncHandler(async (req, res, next) => {
  // 1 - check if there is a token
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new ApiError(
      "please check if you are logged in and try again  ",
      401
    );
  }
  const token = authorizationHeader.split(" ")[1];
  // 2 - check if the token is valid(no change happened,expired token )
  let decodedToken = JWT.verify(token, process.env.JWT_SECRET);
  // 3 - check if user exists
  const user = await User.findOne({ _id: decodedToken.userId, active: true });
  if (!user) {
    throw new ApiError(
      "this account does not exist any more or deactivated try to activate the account or signup again"
    );
  }
  // 4- check if the user changed his password after the generation of the token
  if (user.passwordChangedAt) {
    /*we have in the payload that we received from verifying our 
    token a property called (iat) it has the expiration date 
    for the token so we gonna check it against our passwordChangeAt property */
    const passwordChangedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedTimeStamp > decodedToken.iat) {
      throw new ApiError(
        "the password has been changed since the last login please login again",
        401
      );
    }
  }
  req.user = user;
  next();
});
// @desc User permissions ["admin","manager"]
const authorizedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1- access routes
    // 2 - access registered users (req.user.role)
    if (!roles.includes(req.user.role)) {
      throw new ApiError("you are not allowed to access this route", 403);
    }
    next();
  });
//@ desc forget password
//@route POST /api/v1/auth/forgetPassword
//@access Public

const forgetPassword = asyncHandler(async (req, res, next) => {
  // 1- get User by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new ApiError(
      `there is no user with this email : ${req.body.email}
    please try again`,
      404
    );
  }
  // 2- if user exist generate random 6-digit hashed reset code and save it in database
  // this code will always generate a random 6 digit number
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  //saving our hashed code in our database
  user.passwordResetCode = hashedResetCode;
  // saving the expiration date of the hashed code in our database(15 min)
  user.passwordResetCodeExpirationTime = new Date(
    Date.now() + 60 * 60 * 1000
  ).toISOString();
  user.passwordResetIsVerified = false;
  await user.save();
  // 3- send the reset code to the user email
  const message = `<html>
<head></head>
<body>
  
<h1>HI ${user.name}</h1><hr />
  <p>We have received a request to reset your password on your Zamzam Account</p>
  <hr />
  ${resetCode}
  <hr />
  enter this code to complete the reset <hr />
  thank you for helping us in keeping your account safe <hr />
  <span>;copy</span><hr />
  <h2>ZamZam Application</h2>
</body>
  <html /> `;
  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset code is (valid for 1 hour)",
      content: message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpirationTime = undefined;
    user.passwordResetIsVerified = undefined;
    await user.save();
    throw new ApiError(
      "there was a problem with sending an email please try again or contact us and inform us with the problem",
      500
    );
  }
  res.status(200).json({
    status: "success",
    message: "reset code is sent to the user email",
  });
});
const verifyResetCode = asyncHandler(async (req, res, next) => {
  // 1) get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetCodeExpirationTime: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError("reset code is expired or invalid");
  }
  // 2)- reset code  is valid
  user.passwordResetIsVerified = true;
  await user.save();
  res.status(200).json({ status: "success" });
});
const resetPassword = asyncHandler(async (req, res, next) => {
  //1) get user based on his email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new ApiError("there is no such email address try again", 404);
  }
  //2) check the reset code is verified
  if (!user.passwordResetIsVerified) {
    throw new ApiError("you did not verify your reset code", 400);
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpirationTime = undefined;
  user.passwordResetIsVerified = undefined;
  await user.save();
  //3) if everything is ok generate new JWT Token
  const token = user.generateJWT();
  res.status(200).json({ jwtToken: token });
});
module.exports = {
  signUp,
  login,
  validateJWT,
  authorizedTo,
  forgetPassword,
  verifyResetCode,
  resetPassword,
};
