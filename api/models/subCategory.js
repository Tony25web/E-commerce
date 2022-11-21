const mongoose = require("mongoose");
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "this subCategory is alread existed try another name"],
      minLength: [2, "too short subCategory name"],
      maxLength: [32, "too long subCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "any subCategory must belong to at least one category"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("subCategory", subCategorySchema);
