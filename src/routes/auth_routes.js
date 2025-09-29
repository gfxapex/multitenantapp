const express = require("express"); // <-- missing
const { login, logout, signUp, tokenController } = require("../controllers/index.js");
const { verifyUser } = require("../middlewares/index.js");
const asyncWrapper = require("../middlewares/async_wrapper");

const router = express.Router();

router.post("/login", asyncWrapper(login));
router.post("/signup", asyncWrapper(signUp));
router.post("/logout", verifyUser(), asyncWrapper(logout));
router.post("/autoReLogin", asyncWrapper(tokenController));

module.exports = router;
