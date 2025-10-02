const { StatusCodes } = require("http-status-codes");
const  {asyncWrapper}  = require("../../middlewares/index.js");
const { ApiError, ApiRes, validateEmail, validateUsername,
  PERMISSIONS } = require("../../utils/index.js");
const { Role, User } = require("../../models/index.js");

const signUp = asyncWrapper(async (req, res, next) => {
  const { name, email, username, password } = req.body;
  let existingUser = await User.findOne({ username });

  if (!validateUsername(username)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Username is not valid");
  }
  // 
  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Username already exist.");
  }
  // 
  if (!validateEmail(email)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email is not valid");
  }

  existingUser = await User.findOne({ email });
  // 
  if (existingUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email already exist.");
  }
  // 
  const user = new User({ name, password, email, username });


  let role;
  if (username == process.env.ADMIN_USERNAME) {

    role = await Role.findOne({ roleValue: "admin" });
    user.role = role._id;
  } else {
    role = await Role.findOne({ roleValue: "user" });
    if (!role) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Role not found in DB");
    }
    user.role = role._id;
  }
  user.permissions = [
    PERMISSIONS.USER.CHANGE_PASSWORD,
    PERMISSIONS.USER.UPDATE,
    PERMISSIONS.BLOG.CREATE,
    PERMISSIONS.BLOG.DELETE,
    PERMISSIONS.BLOG.UPDATE,
  ];
  await user.save();
  await user.sendOTP();

  return res.status(StatusCodes.CREATED).json(
    new ApiRes(
      StatusCodes.CREATED,
      {
        username: user.username,
        email: user.email,
        name: user.name,
      },
      "Account Created (Email Verification Sent)"
    )
  );
});

module.exports = signUp;