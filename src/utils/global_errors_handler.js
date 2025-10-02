const globalErrorHandling = async (err, req, res, next) => {
  const status = err.status | 500;
  const message = err.message | "Internal server error";
  const extraDetails = err.extraDetails | "Error from Internal server";

  return req.status(status).json({message, extraDetails})
}

module.exports = globalErrorHandling;