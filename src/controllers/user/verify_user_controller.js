const { StatusCodes } = require("http-status-codes");
const  {asyncWrapper}  = require("../../middlewares/index.js");
const { ApiError, ApiRes } = require("../../utils/index.js");
const { User } = require("../../models/index.js");

const verifyUserByOTP = asyncWrapper(async (req, res, next) => {
  const { email, OTP } = req.body;
  if (!email) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (user.otp != OTP) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid OTP");
  }
  user.isVerified = true;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json(new ApiRes(StatusCodes.OK, {}, "User Verified"));
});

const sendVerifyOTP = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  const mail = await user.sendOTP();
  if (!mail) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to send OTP");
  }
  res
    .status(StatusCodes.OK)
    .json(new ApiRes(StatusCodes.OK, {}, "OTP Sent Successfully"));
});

module.exports = {
  verifyUserByOTP,
  sendVerifyOTP,
};