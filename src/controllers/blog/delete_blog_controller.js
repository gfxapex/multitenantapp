const { StatusCodes } = require("http-status-codes");
const  {asyncWrapper } = require("../../middlewares/index.js");
const { ApiError, ApiRes, deleteFromCloudinary, } = require("../../utils/index.js");
const { Blog } = require("../../models/index.js");

const deleteBlog = asyncWrapper(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Please Provide Slug");
  }
  let blog = await Blog.findOne({ slug }).populate("user");
  if (!blog) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Blog Not Found");
  }
  if (blog.user.username !== req.user.username) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You are not the owner of this blog"
    );
  }
  const result = await deleteFromCloudinary(blog.thumbnailID);
  if (!result) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to delete blog Thumbnail"
    );
  }
  blog = await Blog.findByIdAndDelete(blog._id, { new: true }).populate(
    "user",
    "username name"
  );
  res
    .status(StatusCodes.OK)
    .json(new ApiRes(StatusCodes.OK, blog, "Blog Deleted Successfully"));
});

module.exports =  deleteBlog ;