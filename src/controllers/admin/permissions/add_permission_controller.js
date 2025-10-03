const {httpStatuscode }= require ("http-status-codes");
const  {asyncWrapper}  = require ("../../../middlewares/index.js");
const { Role, User } = require ("../../../models/index.js");
const { ApiError, ApiRes } = require ("../../../utils/index.js");

 const addPermissionToUser = asyncWrapper(async (req, res, next) => {
  const { permission, username } = req.body;
  if (!(username && permission)) {
    throw new ApiError(
      httpStatuscode.BAD_REQUEST,
      "username and permission is required"
    );
  }
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "user not exist");
  }
  user.permissions.push(permission);
  await user.save();
  res
    .status(StatusCodes.OK)
    .json(new ApiRes(httpStatuscode.OK, permission, "Permission added"));
});
 const addPermissionToRole = asyncWrapper(async (req, res, next) => {
  const { permission, roleValue } = req.body;
  if (!(roleValue && permission)) {
    throw new ApiError(
      httpStatuscode.BAD_REQUEST,
      "roleValue and permission is required"
    );
  }
  const role = await Role.findOne({ roleValue });
  if (!role) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "role not exist");
  }
  role.permissions.push(permission);
  await role.save();
  res
    .status(StatusCodes.OK)
    .json(new ApiRes(httpStatuscode.OK, permission, "Permission added"));
});

module.exports = {addPermissionToUser,addPermissionToRole};