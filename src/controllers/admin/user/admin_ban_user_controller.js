const {httpStatuscode} = require ("http-status-codes");
const  {asyncWrapper}  = require ("../../../middlewares/index.js");
const { User } = require ("../../../models/index.js");
const { ApiError, ApiRes } = require ("../../../utils/index.js");

 const banUser = asyncWrapper(async (req, res, next) => {
  const { username, email } = req.body;
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "User not exist");
  }
  user.isBan = true;
  await user.save();
  res
    .status(httpStatuscode.OK)
    .json(new ApiRes(httpStatuscode.OK, null, "User banned successfully"));
});

 const unBanUser = asyncWrapper(async (req, res, next) => {
  const { username, email } = req.body;
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "User not exist");
  }
  user.isBan = false;
  await user.save();
  res
    .status(httpStatuscode.OK)
    .json(new ApiRes(httpStatuscode.OK, null, "User UnBanned successfully"));
});

module.exports = {banUser, unBanUser};