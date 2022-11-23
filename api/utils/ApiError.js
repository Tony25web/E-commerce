// @desc this class is to handle operational errors (error that can be predicated)
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 400;
    this.status = `${this.statusCode}`.startsWith(4) ? "fail" : "error";
    this.isOperational = true;
  }
}
module.exports = { ApiError };
