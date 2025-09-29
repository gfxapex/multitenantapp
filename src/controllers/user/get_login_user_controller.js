const { StatusCodes } = require("http-status-codes");
const  {asyncWrapper } = require("../../middlewares/index.js");
const { ApiError, ApiRes } = require("../../utils/index.js");

const getLoginUser = asyncWrapper(async (req, res, next) => {
  const user = req.user;
  res.status(StatusCodes.OK).json(
    new ApiRes(
      StatusCodes.OK,
      {
        username: user.username,
        email: user.email,
        name: user.name,
        photo: user.photo ? user.photo : "",
        roleName: user.role.roleName,
        roleValue: user.role.roleValue
      },
      "User"
    )
  );
});

module.exports = getLoginUser;