const {httpStatuscode} = require ("http-status-codes");
const  {asyncWrapper}  = require ("../../middlewares/index.js");
const {ApiError,ApiRes,deleteFromCloudinary,uploadOnCloudinary,} = require ("../../utils/index.js");
const {slugify} = require ("slugify");
const { Blog } = require ("../../models/index.js");

 const updateBlog = asyncWrapper(async (req, res, next) => {
  const { title, description, content } = req.body;
  const { slug } = req.params;
  const blog = await Blog.findOne({ slug }).populate("user","username name");
  if (!blog) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "Blog not Exist");
  }
  if(blog.user.username !== req.user.username){
    throw new ApiError(httpStatuscode.UNAUTHORIZED, "You are not authorized to update this blog");
  }
  if (title) blog.title = title;
  if (description) blog.description = description;
  if (content) blog.content = content;

  if (req.file) {
    const deleteResult = await deleteFromCloudinary(blog.thumbnailID);
    if(!deleteResult){
      throw new ApiError(httpStatuscode.INTERNAL_SERVER_ERROR, "Failed to delete image = require cloudinary")
    }
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult) {
      throw new ApiError(
        httpStatuscode.INTERNAL_SERVER_ERROR,
        "Failed to upload image"
      );
    }
    blog.thumbnail = uploadResult.url;
    blog.thumbnailID = uploadResult.public_id;
  }
  await blog.save();
  res
    .status(httpStatuscode.CREATED)
    .json(
      new ApiRes(
        httpStatuscode.CREATED,
        blog,
        "Blog Updated"
      )
    );
});

module.exports = updateBlog;