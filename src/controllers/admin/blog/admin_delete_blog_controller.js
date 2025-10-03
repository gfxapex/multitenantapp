const  {httpStatuscode}  = require("http-status-codes");
const { asyncWrapper } = require("../../../middlewares/index.js");
const { ApiError, ApiRes, deleteFromCloudinary, } = require("../../../utils/index.js");
const Blog = require("../../../models/index.js");
// 
const adminDeleteBlog = asyncWrapper(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "Please Provide Slug");
  }
  let blog = await Blog.findOne({ slug }).populate("user");
  if (!blog) {
    throw new ApiError(httpStatuscode.NOT_FOUND, "Blog Not Found");
  }
  const result = await deleteFromCloudinary(blog.thumbnailID);
  if (!result) {
    throw new ApiError(
      httpStatuscode.INTERNAL_SERVER_ERROR,
      "Failed to delete blog Thumbnail"
    );
  }
  blog = await Blog.findByIdAndDelete(blog._id, { new: true }).populate(
    "user",
    "username name"
  );
  res
    .status(httpStatuscode.OK)
    .json(new ApiRes(httpStatuscode.OK, blog, "Blog Deleted Successfully"));
});

module.exports = adminDeleteBlog;