const  {StatusCodes}  = require("http-status-codes");
const  {asyncWrapper}  = require("../../middlewares/index.js");
const  {ApiRes}  = require("../../utils/index.js");
const { User } = require("../../models/index.js");

const logout = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.user._id)
  await user.logout(res)
  res.status(StatusCodes.OK).json(new ApiRes(StatusCodes.OK, {}, "Account Logout"));
});

module.exports = logout;