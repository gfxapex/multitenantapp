const StatusCodes  = require("http-status-codes");
const  {ApiError}  = require("../utils/index.js");
const asyncWrapper = require("./async_wrapper");

const verifyUser = (permission = null) =>
  asyncWrapper(async (req, res, next) => {
   if (!req.user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Login Required");
    }
    if (permission) {
      if (req.user.role.roleValue == "admin") {
        return next();
      }
      const allUserPermissions = [
        ...req.user.permissions,
        ...req.user.role?.permissions,
      ];
      if (allUserPermissions.includes(permission)) {
        return next();
      }
      throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden");
    }
    return next();
  });


module.exports = verifyUser;
