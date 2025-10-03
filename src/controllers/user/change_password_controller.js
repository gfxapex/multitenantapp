const {httpStatuscode} = require ("http-status-codes");
const  {asyncWrapper}  = require ("../../middlewares/index.js");
const { ApiError, ApiRes } = require ("../../utils/index.js");
 const changePassword = asyncWrapper(async (req, res, next) => {
  const { newPassword, oldPassword } = req.body;
  if (!(newPassword && oldPassword)) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "Invalid Credentials");
  }
  const user = req.user;
  const checkPassword = await user.comparePasswords(String(oldPassword));
  if (!checkPassword) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "Incorrect Old Password");
  }
  user.password = newPassword;
  await user.save();
  res
    .status(httpStatuscode.OK)
    .json(new ApiRes(httpStatuscode.OK, null, "Password Updated"));
});

module.exports = changePassword;