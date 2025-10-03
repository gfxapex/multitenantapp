const {httpStatuscode} = require("http-status-codes");
const  {asyncWrapper}  = require("../../middlewares/index.js");
const { ApiError, ApiRes } = require("../../utils/index.js");
const { User } = require("../../models/index.js");

const verifyUserByOTP = asyncWrapper(async (req, res, next) => {
  const { email, OTP } = req.body;
  if (!email) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "Email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatuscode.NOT_FOUND, "User not found");
  }
  if (user.otp != OTP) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "Invalid OTP");
  }
  user.isVerified = true;
  await user.save();
  res
    .status(httpStatuscode.OK)
    .json(new ApiRes(httpStatuscode.OK, {}, "User Verified"));
});

const sendVerifyOTP = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "Email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatuscode.NOT_FOUND, "User not found");
  }
  const mail = await user.sendOTP();
  if (!mail) {
    throw new ApiError(httpStatuscode.INTERNAL_SERVER_ERROR, "Failed to send OTP");
  }
  res
    .status(httpStatuscode.OK)
    .json(new ApiRes(httpStatuscode.OK, {}, "OTP Sent Successfully"));
});

module.exports = {
  verifyUserByOTP,
  sendVerifyOTP,
};