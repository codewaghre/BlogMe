import { Router } from "express";
import { deleteUser, getAllUser, getUser, updateUser } from "../controllers/user.controller.js";
import upload from "../config/multer.js";
import { authMiddleware } from "../middlewares/auth.middleare.js";

const userRoute = Router()

userRoute.use(authMiddleware)

userRoute.get("/get-user/:id", getUser)
userRoute.put("/update-user/:id", upload.single('file'), updateUser)
userRoute.get("/get-all-user", getAllUser)
userRoute.delete("/delete/:id", deleteUser)

export {
    userRoute
}