const {httpStatuscode} = require("http-status-codes");
const  {asyncWrapper}  = require("../../middlewares/index.js");
const {ApiError,ApiRes,deleteFromCloudinary,uploadOnCloudinary,
} = require("../../utils/index.js");
 const updateProfilePhoto = asyncWrapper(async (req, res, next) => {
  if (!req.file) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "Photo not found");
  }
  const user = req.user;
  if (user.photoID) {
    const oldPhoto = await deleteFromCloudinary(user.photoID);
    if (!oldPhoto) {
      throw new ApiError(
        httpStatuscode.INTERNAL_SERVER_ERROR,
        "Failed to delete old photo"
      );
    }
  }
  const uploadResult = await uploadOnCloudinary(req.file.path);
  if (!uploadResult) {
    throw new ApiError(httpStatuscode.INTERNAL_SERVER_ERROR, "Failed to upload photo")
  }
  user.photo = uploadResult.url;
  user.photoID = uploadResult.public_id;

  await user.save();
  res
    .status(httpStatuscode.OK)
    .json(
      new ApiRes(httpStatuscode.OK, { photo: user.photo }, "Profile Photo Updated")
    );
});

module.exports = updateProfilePhoto;