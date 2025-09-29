// middlewares/async_wrapper.js
const asyncWrapper = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncWrapper;
