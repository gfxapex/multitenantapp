const express = require("express");
const {
  updateUser,
  getLoginUser,
  changePassword,
  forgotPasswordSendOTP,
  forgotPasswordVerifyOTP,
  updateProfilePhoto,
  verifyUserByOTP,
  sendVerifyOTP,
  verifyUsername
} = require("../controllers/index.js");

const { verifyUser, upload, asyncWrapper } = require("../middlewares/index.js");
const PERMISSIONS = require("../utils/permissions.js"); // ✅ correct import

const router = express.Router();

// PATCH / GET split, no .route() chaining
router.patch("/", verifyUser(PERMISSIONS.USER.UPDATE), asyncWrapper(updateUser));
router.get("/", verifyUser(), asyncWrapper(getLoginUser));

// Password
router.patch("/changePassword", verifyUser(PERMISSIONS.USER.CHANGE_PASSWORD), asyncWrapper(changePassword));

// OTP
router.post("/forgotPasswordSendOTP", asyncWrapper(forgotPasswordSendOTP));
router.post("/forgotPassword", asyncWrapper(forgotPasswordVerifyOTP));
router.post("/sendVerifyOTP", asyncWrapper(sendVerifyOTP));
router.patch("/verifyOTP", asyncWrapper(verifyUserByOTP));

// Profile Photo
router.patch("/profilePhoto", verifyUser(PERMISSIONS.USER.UPDATE), upload.single("photo"), asyncWrapper(updateProfilePhoto));

// Username check
router.get("/checkUsername/:username", asyncWrapper(verifyUsername));

module.exports = router;
