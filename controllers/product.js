const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const factory = require("./handlerFactory");
const Product = require("../models/product");
const { uploadMixOfImages } = require("../middlewares/uploadImage");
exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 8,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1000)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);
    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1000)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );

    next();
  }
});
// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = factory.getAll(Product, "Product");

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne(Product, "Product", "reviews");

// @desc    Create product
// @route   POST  /api/v1/products
// @access  Private
exports.createProduct = factory.createOne(Product, "Product");
// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = factory.updateOne(Product, "Product");

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(Product, "Product");
