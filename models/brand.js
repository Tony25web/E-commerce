const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand required"],
      unique: [true, "brand must be unique"],
      minLength: [3, "too Short please write longer brand"],
      maxLength: [35, "surpassed the maximum length of a brand name "],
    },
    // A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageURL;
  }
};
brandSchema.post("init", function (doc) {
  setImageUrl(doc);
});
brandSchema.post("save", function (doc) {
  setImageUrl(doc);
});
module.exports = mongoose.model("brand", brandSchema);
