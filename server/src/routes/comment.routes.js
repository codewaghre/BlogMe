import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleare.js";
import { addComment, commentCount, deleteComment, getAllComments, getComments } from "../controllers/comment.controller.js";

const commentRoute = Router()

commentRoute.post("/add", authMiddleware, addComment)
commentRoute.get("/get/:blogid", getComments)
commentRoute.get("/get-count/:blogid", commentCount)
commentRoute.get("/get-all-comment", authMiddleware, getAllComments)
commentRoute.delete("/delete/:commentid", authMiddleware, deleteComment)


export { commentRoute }