const { StatusCodes } = require ("http-status-codes");
const  {asyncWrapper}  = require ("../../middlewares/index.js");
const  {User}  = require ("../../models/index.js");
const { ApiError, ApiRes } = require ("../../utils/index.js");

 const forgotPasswordSendOTP = asyncWrapper(async (req, res, next) => {
  const {email} = req.body;
  if(!email){
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email is required");
  }
  const user = await User.findOne({email})
  if(!user){
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  if(!user.isVerified){
    throw new ApiError(StatusCodes.FORBIDDEN, "User is not verified");
  }
  if(user.isBan){
    throw new ApiError(StatusCodes.FORBIDDEN, "User is banned");
  }
  const mail = await user.sendOTP("DeathCode - OTP Password Reset Mail")
  if(!mail){
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to send OTP");
  }
  res.status(StatusCodes.OK).json(new ApiRes(StatusCodes.OK,null, "OTP sent successfully"));
});

 const forgotPasswordVerifyOTP = asyncWrapper(async (req, res, next) => {
  const {email,OTP,newPassword} = req.body;
  if(!email){
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email is required");
  }
  const user = await User.findOne({email})
  if(!user){
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  if(!user.isVerified){
    throw new ApiError(StatusCodes.FORBIDDEN, "User is not verified");
  }
  if(user.isBan){
    throw new ApiError(StatusCodes.FORBIDDEN, "User is banned");
  }

  if(user.otp != OTP){
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid OTP");
  }
  user.password = newPassword
  await user.save()
  res.status(StatusCodes.OK).json(new ApiRes(StatusCodes.OK,null, "Password reset successfully"));
});

module.exports = {forgotPasswordSendOTP, forgotPasswordVerifyOTP};