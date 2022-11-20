const SubCategory = require("../models/subCategory");
const Factory = require("./handlerFactory");

//----------------------------------------------------------//
//@desc  get a list of subcategories
// @route GET /api/v1/subcategories
//access public

const getSubCategories = Factory.getAll(SubCategory, "SubCategory");

//----------------------------------------------------------//
// @desc get a single category by category id
//@route GET /api/v1/subcategories/:id
//access public

const getASubCategory = Factory.getOne(SubCategory, "SubCategory");

//----------------------------------------------------------//
// @desc create a category
//@route POST /api/v1/subcategories/create
//access private (admin)

const createSubCategory = Factory.createOne(SubCategory, "SubCategory");

//----------------------------------------------------------------//
//@desc update a category
//@route PATCH /api/v1/categories/:id
//@access private(admin)

const updateSubCategory = Factory.updateOne(SubCategory, "SubCategory");

//------------------------------------------------------------//
//@desc delete a category
//@route DELETE /api/v1/categories/:id
//@access private(admin)

const deleteSubCategory = Factory.deleteOne(SubCategory, "Sub Category");

const setCategoryIdToBody = (req, res, next) => {
  /* nested route is used here for creating 
  a sub category in case there is no category Id
  in request body*/

  if (!req.body.category) req.body.category = req.params.id;
  next();
};

const createFilterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.id) {
    filterObj = { category: req.params.id };
  }
  req.objFilter = filterObj;
  next();
};
module.exports = {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  getASubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
};
