const  {StatusCodes}  = require("http-status-codes");
const  {asyncWrapper}  = require("../../middlewares/index.js");
const  {ApiError,ApiRes}  = require("../../utils/index.js");
const { User } = require("../../models/index.js");

// 
console.log("👉 ApiError from utils/index.js:", ApiError);
// 
const logout = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  // cookie clear kar
  res.clearCookie("accessToken", { httpOnly: true, secure: true });

  return res
    .status(StatusCodes.OK)
    .json(new ApiRes(StatusCodes.OK, {}, "Account Logout"));
});


module.exports = logout;