const multer = require("multer");
const { ApiError } = require("../utils/ApiError");
/*1 - Disk storage engine :used for saving the uploaded images as files in the destination folder but
  you can't use image processing middleWares like sharp because its input is Buffer and this type doesn't
  give us a buffer as a result
*/
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "uploads/categories");
//   },
//   filename: function (req, file, callback) {
//     the way i want to store the image => category-${id}-Date.now().extension
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     callback(null, filename);
//   },
// });

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
