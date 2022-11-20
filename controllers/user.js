/*
All operations that concern the administrator like CRUD Operations (Admin)
*/
const bcrypt = require("bcryptjs");
const { ApiError } = require("../utils/ApiError");
const User = require("../models/user");
const Factory = require("./handlerFactory");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/uploadImage");
const UserImageUploader = uploadSingleImage("profileImage");
const asyncHandler = require("express-async-handler");
//image processing
const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);
    req.body.profileImage = filename;
  }
  next();
});
//@ fetching all Users
//@route GET /api/v1/users
//@access Private(admin)

const getUsers = Factory.getAll(User, "User");

//@ fetching specific User
//@route GET /api/v1/user/:id
//@access Private(admin)

const getUser = Factory.getOne(User, "User");

//@desc create a brand
//@route POST /api/v1/users/create
//@access Private(admin)

const createUser = Factory.createOne(User, "User");

//@desc update a User
//@route PATCH /api/v1/user/:Id
//@access Private(admin)
const updateUser = asyncHandler(async (req, res, next) => {
  const updatedDocument = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    { new: true }
  );
  if (!updatedDocument) {
    return next(
      new ApiError(`there is no user with this Id ${req.params.id}`, 404)
    );
  }
  res
    .status(200)
    .json({ message: "updated successfully ", user: updatedDocument });
});
const changePassword = asyncHandler(async (req, res, next) => {
  const updatedDocument = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!updatedDocument) {
    return next(
      new ApiError(`there is no User with this Id ${req.params.id}`, 404)
    );
  }
  res
    .status(200)
    .json({ message: "updated successfully ", user: updatedDocument });
});

//@desc delete a User
//@route DELETE /api/v1/user/:Id
//@access Private(admin)

const deleteUser = Factory.deleteOne(User, "User");

const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) find the user and update user
  const updatedPassword = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!updatedPassword) {
    return next(
      new ApiError(`there is no User with this Id ${req.params.id}`, 404)
    );
  }
  // 2) generate token and send it the user (this is the difference between this controller and the admin changePassword controller)
  const Token = updatedPassword.generateJWT();
  res.status(200).json({ message: "updated successfully ", jwtToken: Token });
});
const updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { name: req.body.name, email: req.body.email, phone: req.body.phone },
    { new: true }
  );
  if (!user) {
    throw new ApiError(`there is no user with this id ${req.user._id}`);
  }
  res
    .status(204)
    .json({ message: "your information has been updated successfully" });
});
const deactivateLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate({ _id: req.user._id }, { active: false });
  res.status(204).json({
    message:
      "your account is now deactivated if you want to activate it again go to this URL",
  });
});
module.exports = {
  deleteUser,
  deactivateLoggedUser,
  updateLoggedUserPassword,
  changePassword,
  updateLoggedUserData,
  getLoggedUserData,
  updateUser,
  createUser,
  getUser,
  getUsers,
  UserImageUploader,
  resizeImage,
};
