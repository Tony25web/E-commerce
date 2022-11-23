const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "too short product title"],
      maxLength: [100, "too long product title"],
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "product description is required"],
      minLength: [20, "too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      max: [20000, "too expensive for a product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    images: [String],
    imageCover: {
      type: String,
      required: [true, "the product must have a least cover image"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "the product must belong to a category"],
    },
    subCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "rating must equal or above 1.0"],
      max: [5, "rating must equal or under 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageURL = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageURL;
  }
  if (doc.images) {
    let img = [];
    doc.images.forEach((image) => {
      const imageURL = `${process.env.BASE_URL}/products/${image}`;
      img.push(imageURL);
    });
    doc.images = img;
  }
};
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
//mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name -_id" });
  next();
});
// find findOne UpdateOne
productSchema.post("init", (doc) => {
  setImageUrl(doc);
});
// createOne
productSchema.post("save", (doc) => {
  setImageUrl(doc);
});
module.exports = mongoose.model("Product", productSchema);
