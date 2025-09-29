
// Auth
const  logout  = require("./auth/logout_controller.js");
const  signUp  = require("./auth/signup_controller.js");
const tokenController  = require("./auth/token_controller.js");
const login  = require("./auth/login_controller.js");

// Blog
const  createBlog  = require("./blog/create_blog_controller.js");
const  deleteBlog  = require("./blog/delete_blog_controller.js");
const updateBlog  = require("./blog/update_blog_controller.js");
const { getBlog, getBlogs } = require("./blog/get_blog_controller.js");

// User
const { changePassword } = require("./user/change_password_controller.js");
const { forgotPasswordSendOTP, forgotPasswordVerifyOTP } = require("./user/forgot_password_controller.js");
const { updateProfilePhoto } = require("./user/update_profile_photo_controller.js");
const { verifyUserByOTP, sendVerifyOTP } = require("./user/verify_user_controller.js");
const  verifyUsername  = require("./user/verify_username_controller.js");
const  updateUser  = require("./user/update_user_controller.js");
const getLoginUser  = require("./user/get_login_user_controller.js");

// Admin
const  adminDeleteBlog  = require("./admin/blog/admin_delete_blog_controller.js");
const { addPermissionToUser, addPermissionToRole } = require("./admin/permissions/add_permission_controller.js");
const { deletePermissionFromRole, deletePermissionFromUser } = require("./admin/permissions/delete_permission_controller.js");
const { getPermissions } = require("./admin/permissions/get_permission_controller.js");
const { addRoleToUser, createRole } = require("./admin/roles/add_role_controller.js");
const { deleteRoleFromUser } = require("./admin/roles/delete_role_controller.js");
const { banUser, unBanUser } = require("./admin/user/admin_ban_user_controller.js");
const { adminDeleteUser } = require("./admin/user/admin_delete_user_controller.js");

module.exports = {
  // Auth
  logout,
  signUp,
  tokenController,
  login,

  // Blog
  createBlog,
  deleteBlog,
  updateBlog,
  getBlog,
  getBlogs,

  // User
  changePassword,
  forgotPasswordSendOTP,
  forgotPasswordVerifyOTP,
  updateProfilePhoto,
  updateUser,
  getLoginUser,
  verifyUserByOTP,
  sendVerifyOTP,
  verifyUsername,

  // Admin
  adminDeleteBlog,
  addPermissionToUser,
  addPermissionToRole,
  deletePermissionFromRole,
  deletePermissionFromUser,
  getPermissions,
  addRoleToUser,
  createRole,
  deleteRoleFromUser,
  banUser,
  unBanUser,
  adminDeleteUser,
};
