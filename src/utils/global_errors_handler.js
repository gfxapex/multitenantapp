// src/utils/global_errors_handler.js
const globalErrorHandling = (err, req, res, next) => {
  // Prevent duplicate responses
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = globalErrorHandling;
