// src/controllers/blog/create_blog_controller.js
const { StatusCodes } = require("http-status-codes");
const { asyncWrapper } = require("../../middlewares");
const { ApiError, ApiRes, uploadOnCloudinary } = require("../../utils"); // adjust if your util names/paths differ
const { Blog } = require("../../models");

const createBlog = asyncWrapper(async (req, res) => {
  // Minimal safe implementation — replace with your logic
  // If you upload file via multer, file will be in req.file
  const { title, description, content } = req.body;

  if (!title) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Title is required");
  }

  const blogData = {
    title,
    description: description || "",
    content: content || "",
    user: req.user?._id ?? null, // assuming req.user is set by auth middleware
  };

  // If you want to upload thumbnail to cloud, example (optional):
  // if (req.file) {
  //   const uploaded = await uploadOnCloudinary(req.file.path, "thumbnails");
  //   blogData.thumbnail = uploaded.secure_url;
  // }

  const blog = await Blog.create(blogData);

  res
    .status(StatusCodes.CREATED)
    .json(new ApiRes(StatusCodes.CREATED, blog, "Blog created"));
});

module.exports =  createBlog ;
