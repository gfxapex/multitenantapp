const {httpStatuscode} = require ("http-status-codes");
const  {asyncWrapper}  = require ("../../../middlewares/index.js");
const { Blog, User } = require ("../../../models/index.js");
const { ApiError, ApiRes } = require ("../../../utils/index.js");

 const adminDeleteUser = asyncWrapper(async (req, res, next) => {
  const { username, email } = req.body;
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "User not exist");
  }
  await Blog.deleteMany({user:user._id})
  await User.findByIdAndDelete(user._id)
  res
    .status(httpStatuscode.OK)
    .json(new ApiRes(httpStatuscode.OK, null, "User deleted successfully"));
});

module.exports = {adminDeleteUser};