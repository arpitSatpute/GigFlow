import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if(!token) {
        return res.status(401).json({
            success: false,
            error: "Not authorised for this route",
        });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decode.userId).select('-password');

        if(!req.user) {
            return res.status(401).json({
                success: false,
                error: "User not found"
            });
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
});

