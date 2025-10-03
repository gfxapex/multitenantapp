const {httpStatuscode} = require ("http-status-codes");
const  {asyncWrapper}  = require ("../../middlewares/index.js");
const  {User}  = require ("../../models/index.js");
const { ApiError, ApiRes } = require ("../../utils/index.js");

 const forgotPasswordSendOTP = asyncWrapper(async (req, res, next) => {
  const {email} = req.body;
  if(!email){
    throw new ApiError(httpStatuscode.BAD_REQUEST, "Email is required");
  }
  const user = await User.findOne({email})
  if(!user){
    throw new ApiError(httpStatuscode.NOT_FOUND, "User not found");
  }
  if(!user.isVerified){
    throw new ApiError(httpStatuscode.FORBIDDEN, "User is not verified");
  }
  if(user.isBan){
    throw new ApiError(httpStatuscode.FORBIDDEN, "User is banned");
  }
  const mail = await user.sendOTP("DeathCode - OTP Password Reset Mail")
  if(!mail){
    throw new ApiError(httpStatuscode.INTERNAL_SERVER_ERROR, "Failed to send OTP");
  }
  res.status(httpStatuscode.OK).json(new ApiRes(httpStatuscode.OK,null, "OTP sent successfully"));
});

 const forgotPasswordVerifyOTP = asyncWrapper(async (req, res, next) => {
  const {email,OTP,newPassword} = req.body;
  if(!email){
    throw new ApiError(httpStatuscode.BAD_REQUEST, "Email is required");
  }
  const user = await User.findOne({email})
  if(!user){
    throw new ApiError(httpStatuscode.NOT_FOUND, "User not found");
  }
  if(!user.isVerified){
    throw new ApiError(httpStatuscode.FORBIDDEN, "User is not verified");
  }
  if(user.isBan){
    throw new ApiError(httpStatuscode.FORBIDDEN, "User is banned");
  }

  if(user.otp != OTP){
    throw new ApiError(httpStatuscode.BAD_REQUEST, "Invalid OTP");
  }
  user.password = newPassword
  await user.save()
  res.status(httpStatuscode.OK).json(new ApiRes(httpStatuscode.OK,null, "Password reset successfully"));
});

module.exports = {forgotPasswordSendOTP, forgotPasswordVerifyOTP};