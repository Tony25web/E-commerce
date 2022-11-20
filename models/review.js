const mongoose = require("mongoose");
const Product = require("./product");
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      minLength: [1, "minimum rating is 1.0"],
      maxLength: [5, "maximum rating is 5.0"],
      required: [true, "you must rate the product at least with a 1 star"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "any review must belongs to a user"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [
        true,
        "you must login before you can add a review to a product",
      ],
    },
  },
  { timestamps: true }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});
reviewSchema.statics.calculateAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    // 1) match all reviews on a product identical with productId
    { $match: { product: productId } },
    /* 2) group all these reviews based on there product id and 
    calculate the average of rating and the number of matched documents */
    {
      $group: {
        _id: productId,
        ratingsQuantity: { $sum: 1 },
        ratingsAverage: { $avg: "$ratings" },
      },
    },
  ]);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: result[0].ratingsQuantity,
      ratingsAverage: result[0].ratingsAverage,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};
reviewSchema.post("save", async function (next) {
  await this.constructor.calculateAverageRatingsAndQuantity(this.product);
});
reviewSchema.post("remove", async function (next) {
  await this.constructor.calculateAverageRatingsAndQuantity(this.product);
});
module.exports = mongoose.model("Review", reviewSchema);
