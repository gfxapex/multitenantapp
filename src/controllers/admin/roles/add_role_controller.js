const {httpStatuscode} = require ("http-status-codes");
const  {asyncWrapper}  = require ("../../../middlewares/index.js");
const { Role, User } = require ("../../../models/index.js");
const { ApiError, ApiRes } = require ("../../../utils/index.js");

const createRole = asyncWrapper(async (req, res, next) => {
  const { roleValue, roleName } = req.body;
  if (!(roleValue && roleName)) {
    throw new ApiError(
      httpStatuscode.BAD_REQUEST,
      "Role value & name is required"
    );
  }
  const role = new Role({ roleValue, roleName });
  await role.save();
  res
    .status(httpStatuscode.OK)
    .json(new ApiRes(httpStatuscode.OK, role, "Role Added successfully"));
});
 const addRoleToUser = asyncWrapper(async (req, res, next) => {
  const { username, email, roleValue } = req.body;
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "User not exist");
  }
  const role = await Role.findOne({ roleValue });
  if (!role) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "Role not exist");
  }
  user.role = role._id;
  await user.save();
  res
    .status(httpStatuscode.OK)
    .json(new ApiRes(httpStatuscode.OK, null, "User Role Updated successfully"));
});

module.exports = {createRole,addRoleToUser};