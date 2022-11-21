const { ApiError } = require("../utils/ApiError");
const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV == "development") {
    sendErrorForDev(error, res);
  } else {
    if (error.name === "JsonWebTokenError")
      error = JWTErrorHandler("JsonWebTokenError");
    if (error.name === "TokenExpiredError")
      error = JWTErrorHandler("TokenExpiredError");
    sendErrorForProduction(error, res);
  }
};
const JWTErrorHandler = (name) => {
  if (name === "JsonWebTokenError") {
    return new ApiError("invalid token format try login again", 401);
  } else {
    return new ApiError("token date is expired login again ", 401);
  }
};
const sendErrorForDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error: error,
    stack: error.stack, // where did the error happen
  });
};
const sendErrorForProduction = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};
module.exports = { errorHandler };
