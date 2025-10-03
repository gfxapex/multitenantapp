const {httpStatuscode }= require ("http-status-codes");
const  {asyncWrapper}  = require ("../../../middlewares/index.js");
const { Role, User } = require ("../../../models/index.js");
const { ApiError, ApiRes } = require ("../../../utils/index.js");

 const deleteRoleFromUser = asyncWrapper(async (req, res, next) => {
  const { username, email } = req.body;
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "User not exist");
  }
  let role = await Role.findOne({ roleValue: "user" });
  user.role = role._id;
  await user.save();
  res
    .status(httpStatuscode.OK)
    .json(new ApiRes(httpStatuscode.OK, null, "User Role Updated successfully"));
});

module.exports = {deleteRoleFromUser};