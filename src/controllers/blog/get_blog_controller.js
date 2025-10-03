const {httpStatuscode} = require("http-status-codes");
const { asyncWrapper } = require("../../middlewares/index.js");
const { ApiError, ApiRes } = require("../../utils/index.js");
const { Blog, User } = require("../../models/index.js");

const getBlog = asyncWrapper(async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    throw new ApiError(httpStatuscode.BAD_REQUEST, "Please Provide Slug");
  }
  const blog = await Blog.findOne({ slug }).populate("user", "username name");
  if (!blog) {
    throw new ApiError(httpStatuscode.NOT_FOUND, "Blog Not Found");
  }
  res.status(httpStatuscode.OK).json(new ApiRes(httpStatuscode.OK, blog, "OK"));
});

const getBlogs = asyncWrapper(async (req, res) => {
  const { page, limit, text, username } = req.query;
  const query = {};
  const pagination = {};

  if (username) {
    const user = await User.findOne({ username });
    if (user) query.user = user._id;
  }

  if (text?.trim()) {
    query["$or"] = [
      { title: { $regex: text, $options: "i" } },
      { description: { $regex: text, $options: "i" } },
      { content: { $regex: text, $options: "i" } },
    ];
  }

  pagination.page = parseInt(page) || 1;
  pagination.limit = parseInt(limit) || 10;
  pagination.offSet = pagination.page * pagination.limit - pagination.limit;

  const blogs = await Blog.find(query)
    .populate("user", "username name")
    .sort("-createdAt")
    .skip(pagination.offSet)
    .limit(pagination.limit);

  const blogsCount = await Blog.countDocuments(query);
  pagination.totalPage = Math.ceil(blogsCount / pagination.limit);

  res
    .status(httpStatuscode.OK)
    .json(new ApiRes(httpStatuscode.OK, blogs, "All Blogs...", { ...pagination }));
});

module.exports = { getBlog, getBlogs };
