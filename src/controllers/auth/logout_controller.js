const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../../middlewares/async_wrapper");
const { ApiRes } = require("../../utils/index");
const  {User}  = require("../../models/index");

const logout = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  await user.logout(res); // ⬅️ This is where the actual logout (e.g., clearing tokens/cookies) happens
  res.status(StatusCodes.OK).json(new ApiRes(StatusCodes.OK, {}, "Account Logout"));
});

module.exports = logout;