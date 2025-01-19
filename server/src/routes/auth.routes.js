import { Router } from "express";
import { googleLogin, loginUser, logoutUser, registerUser, resetPassword } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleare.js";


const authRoute = Router()

authRoute.post("/register", registerUser)
authRoute.post("/login", loginUser)
authRoute.post("/google", googleLogin)

authRoute.post("/logout", authMiddleware, logoutUser)
authRoute.put("/reset-password", authMiddleware, resetPassword)

export { authRoute }