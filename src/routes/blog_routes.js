const express = require("express");
const { createBlog, deleteBlog, getBlog, getBlogs, updateBlog } = require("../controllers");
const { upload, verifyUser } = require("../middlewares/index");
const PERMISSIONS = require("../utils/permissions"); // ✅ correct import

const router = express.Router();

router.route("/").get(getBlogs).post(verifyUser(PERMISSIONS.BLOG.CREATE),upload.single("thumbnail"),createBlog
  );

router.route("/:slug").get(getBlog).delete(verifyUser(PERMISSIONS.BLOG.DELETE), deleteBlog).patch(verifyUser(PERMISSIONS.BLOG.UPDATE),upload.single("thumbnail"),updateBlog
  );

module.exports = router;
