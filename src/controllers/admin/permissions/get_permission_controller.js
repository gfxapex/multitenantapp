const {httpStatuscode }= require ("http-status-codes");
const {asyncWrapper}  = require ("../../../middlewares/index.js");
const { Role, User } = require ("../../../models/index.js");
const { ApiError, ApiRes, PERMISSIONS } = require ("../../../utils/index.js");

 const getPermissions = asyncWrapper(async (req, res, next) => {
  const { username, roleValue } = req.query;
  if (username) {
    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(httpStatuscode.BAD_REQUEST, "user not exist");
    }
    return res
      .status(httpStatuscode.OK)
      .json(new ApiRes(httpStatuscode.OK, user.permissions));
  } else if (roleValue) {
    const role = await Role.findOne({ roleValue });
    if (!role) {
      throw new ApiError(httpStatuscode.BAD_REQUEST, "role not exist");
    }
    return res
      .status(httpStatuscode.OK)
      .json(new ApiRes(httpStatuscode.OK, role.permissions));
  } else {
    const permissionsList = Object.values(PERMISSIONS).flatMap((group) =>
      Object.values(group)
    );
    return res
      .status(httpStatuscode.OK)
      .json(new ApiRes(httpStatuscode.OK, permissionsList));
  }
});

module.exports = {getPermissions};