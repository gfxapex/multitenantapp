const { StatusCodes } = require("http-status-codes");
const { asyncWrapper } = require("../../middlewares/index.js");
const jwt = require("jsonwebtoken");
const { ApiError, ApiRes } = require("../../utils/index.js");
const { User } = require("../../models/index.js");

const tokenController = asyncWrapper(async (req, res, next) => {
    // Assuming client sends the refresh token in the BODY.
    const { refreshToken } = req.body; 

    if (!refreshToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token is missing. Please provide it in the request body.");
    }
    try {
        // 1. Validate the Refresh Token
        const decodeToken = jwt.verify(
            refreshToken,
            process.env.JWT_SECRET
        );
        
        // 2. Find User
        const user = await User.findOne({
            username: decodeToken.username,
        }).populate("role");

        // 3. Check for Token Replay (Security Check)
        // Use UNAUTHORIZED for security issues, not BAD_REQUEST.
        if (!user || user.refreshToken !== refreshToken) { 
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid Token or Token compromised. Please log in again.");
        }
        
        // 4. Generate New Access Token (Sets accessToken cookie)
        const accessToken = user.generateAccessToken(res); 

        // 5. Generate New Refresh Token (Sets new refreshToken cookie AND saves to DB inside the method)
        const newRefreshToken = await user.generateRefreshToken(res); 
        
        // 🛑 REMOVED REDUNDANT DATABASE SAVE: 
        // user.refreshToken = newRefreshToken; 
        // await user.save(); 

        // 6. Send Response
        res.status(StatusCodes.OK).json(
            new ApiRes(
                StatusCodes.OK,
                {
                    accessToken,
                    refreshToken: newRefreshToken,
                },
                "Access Token Updated"
            )
        );
    } catch (error) {
        // Handle JWT-specific errors (expired, invalid signature)
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             // Treat all JWT verification failures as unauthorized.
             throw new ApiError(StatusCodes.UNAUTHORIZED, "Session expired or token invalid. Please log in again.");
        }
        
        next(error);
    }
});

module.exports = tokenController;