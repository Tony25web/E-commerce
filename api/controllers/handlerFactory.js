const asyncHandler = require("express-async-handler");
const { ApiError } = require("../utils/ApiError");
const { ApiFeatures } = require("../utils/apiFeatures");
exports.deleteOne = (Model, ModelName) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findOneAndDelete({ _id: id });
    if (!document) {
      return next(
        new ApiError(`there is no ${ModelName} with this Id ${id}`, 404)
      );
    }
    document.remove();
    res.status(200).json({ message: `${ModelName} is deleted successfully` });
  });
exports.updateOne = (Model, ModelName) =>
  asyncHandler(async (req, res, next) => {
    const updatedDocument = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDocument) {
      return next(
        new ApiError(
          `there is no ${ModelName} with this Id ${req.params.id}`,
          404
        )
      );
    }
    // trigger the save event when the document is updated
    updatedDocument.save();
    res
      .status(200)
      .json({ message: "updated successfully ", [ModelName]: updatedDocument });
  });

exports.getAll = (Model, ModelName) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.objFilter) {
      filter = req.objFilter;
    }
    const documentCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .pagination(documentCounts)
      .search(ModelName)
      .sort()
      .limitFields();
    const { MongooseQuery, PaginationResult } = apiFeatures;
    const document = await MongooseQuery;
    res.status(200).json({
      result: document.length,
      pagination: PaginationResult,
      [ModelName]: document,
    });
  });
exports.createOne = (Model, ModelName) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({ [ModelName]: document });
  });
exports.getOne = (Model, ModelName, populateOPT) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populateOPT) {
      query = query.populate(populateOPT);
    }
    const document = await query;
    if (!document) {
      throw new ApiError(`no ${ModelName} found `, 404);
    }
    res.status(200).json({ [ModelName]: document });
  });
