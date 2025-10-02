const {User} = require("../models/index.js");
const asyncWrapper = require("./async_wrapper.js");
const jwt = require('jsonwebtoken');
const { ApiError } = require("../utils"); // Assuming ApiError is available

const authGuard = asyncWrapper(async (req, res, next) => {
    let token = null;

    if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    } else if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
        try {
            const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
            // Check if user exists after decoding token
            const user = await User.findOne({ username: decodeToken.username }).populate("role");

            if (!user) {
                // Token is valid but user no longer exists (e.g., deleted account)
                throw new ApiError(401, "User not found"); 
            }

            req.user = user;
            next();

        } catch (error) {
            // Handle cleanup (clearing the old token cookie 'lt')
            const cookiesOption = { 
                maxAge: 0, httpOnly: true, sameSite: "strict",
                secure: process.env.NODE_ENV == "production"
            };
            if (process.env.NODE_ENV == "production") {
                cookiesOption.domain = ".deathcode.in";
            }
            res.cookie('lt', "", cookiesOption);
            
            // 🛑 CRITICAL CHANGE: Throw an authentication error
            // The catch block mostly handles JWT errors (expired, invalid signature)
            throw new ApiError(401, "Invalid or Expired Token"); 
        }
    } else {
        // Handle cleanup for missing token as well
        const cookiesOption = { 
            maxAge: 0, httpOnly: true, sameSite: "strict",
            secure: process.env.NODE_ENV == "production"
        };
        if (process.env.NODE_ENV == "production") {
            cookiesOption.domain = ".deathcode.in";
        }
        res.cookie('lt', "", cookiesOption);

        // 🛑 CRITICAL CHANGE: Throw a missing token error
        throw new ApiError(401, "Authentication Token is Missing");
    }
});

module.exports = authGuard;