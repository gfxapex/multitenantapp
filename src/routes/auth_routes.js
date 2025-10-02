const express = require("express");
const { login, logout, signUp, tokenController } = require("../controllers/index.js");
const { verifyUser, authGuard } = require("../middlewares/index.js");
const {asyncWrapper} = require("../middlewares/index.js");

const router = express.Router();

router.post("/login", asyncWrapper(login));
router.post("/signup", asyncWrapper(signUp));
router.post("/logout", authGuard, verifyUser(), asyncWrapper(logout));
router.post("/autoReLogin", asyncWrapper(tokenController));

module.exports = router;
