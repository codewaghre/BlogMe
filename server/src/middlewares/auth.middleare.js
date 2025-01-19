
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/user.model.js";
import { handleError } from "../utils/apiErrorHandler.js";


const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken
        if (!token) {
            return next(handleError(403, 'Unathorized'))
        }
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("auth", decodeToken);

        req.user = decodeToken
        console.log(req.user);
        next()
    } catch (error) {
        next(500, error.message)
    }
};

export { authMiddleware }