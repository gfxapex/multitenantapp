const { StatusCodes } = require("http-status-codes");
const  {asyncWrapper}  = require("../../middlewares/index.js");
const jwt = require("jsonwebtoken");
const { ApiError, ApiRes } = require("../../utils/index.js");
const { User } = require("../../models/index.js");

const tokenController = asyncWrapper(async (req, res, next) => {
  const { refreshToken } = req.body;
  try {
    const decodeToken = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET
    );
    const user = await User.findOne({
      username: decodeToken.username,
    }).populate("role");
    if (user.refreshToken != refreshToken) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Token");
    }
    const accessToken = user.generateAccessToken(res);
    const newRefreshToken = await user.generateRefreshToken();
    user.refreshToken = newRefreshToken;
    await user.save();
    res.status(StatusCodes.OK).json(
      new ApiRes(
        StatusCodes.OK,
        {
          accessToken,
          refreshToken: newRefreshToken,
        },
        "Access Token Updated"
      )
    );
  } catch (error) {
    next(error);
  }
});

module.exports = tokenController;