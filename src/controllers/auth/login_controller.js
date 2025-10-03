const {httpStatuscode} =require ("http-status-codes");
const  {asyncWrapper}  =require ("../../middlewares/index.js");
const {ApiError ,ApiRes,validateEmail,validateUsername,} =require ("../../utils/index.js");
const { User } =require ("../../models/index.js");

 const login = asyncWrapper(async (req, res, next) => {
  const { email, username, password } = req.body;
  if (username) {
    if (!validateUsername(username)) {
      throw new ApiError(httpStatuscode.BAD_REQUEST, "Username is not valid");
    }
  } else if (email) {
    if (!validateEmail(email)) {
      throw new ApiError(httpStatuscode.BAD_REQUEST, "Email is not valid");
    }
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  }).populate("role");
  if (!user) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "User not exist");
  }

  const isValidPassword = await user.comparePasswords(password);
  if (!isValidPassword) {
    throw new ApiError(httpStatuscode.UNAUTHORIZED, "Invalid Credentials");
  }

  if (user.isBan) {
    throw new ApiError(httpStatuscode.FORBIDDEN, "User is banned");
  }
  if (!user.isVerified) {
    throw new ApiError(httpStatuscode.FORBIDDEN, "User is not verified");
  }

  const accessToken = user.generateAccessToken(res);
  const refreshToken = await user.generateRefreshToken(res);

  res.status(httpStatuscode.OK).json(
    new ApiRes(
      httpStatuscode.OK,
      {
        username: user.username,
        email: user.email,
        name: user.name,
        photo: user.photo ? user.photo : "",
        role: user.role.name,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      "Account Logged in "
    )
  );
});

module.exports = login;