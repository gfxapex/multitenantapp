const {httpStatuscode} = require("http-status-codes");
const  {asyncWrapper}  = require("../../middlewares/index.js");
const { User } = require("../../models/index.js");
const { ApiError, ApiRes, validateUsername } = require("../../utils/index.js");


const updateUser = asyncWrapper(async (req, res, next) => {
  const { name, username } = req.body;
  const user = req.user;
  user.name = name || user.name;
  if (username) {
    if (!validateUsername(username)) {
      throw new ApiError(httpStatuscode.BAD_REQUEST, "Invalid Username");
    }
    const isUserExist = await User.exists({ username });
    if (isUserExist && isUserExist.username !== user.username) {
      throw new ApiError(httpStatuscode.BAD_REQUEST, "Username already in use");
    }
    user.username = username;
  }
  await user.save();
  res.status(httpStatuscode.OK).json(
    new ApiRes(
      httpStatuscode.OK,
      {
        username: user.username,
        name: user.name,
        email: user.email,
      },
      "User Updated"
    )
  );
});

module.exports = updateUser;