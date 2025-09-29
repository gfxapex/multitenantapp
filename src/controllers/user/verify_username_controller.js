const { StatusCodes } = require("http-status-codes");
const  {asyncWrapper}  = require("../../middlewares/index.js");
const { ApiError, ApiRes } = require("../../utils/index.js");
const { User } = require("../../models/index.js");

// 
const verifyUsername = asyncWrapper(async (req, res, next) => {
  
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Username already exists");
  }
  res
    .status(StatusCodes.OK)
    .json(new ApiRes(StatusCodes.OK, { username }, "Username is available"));
});

module.exports = verifyUsername;