
import { Router } from "express";
import { countLike, doLike } from "../controllers/like.controller.js";
import { authMiddleware } from "../middlewares/auth.middleare.js";


const likeRoute = Router()

likeRoute.post("/do-like", authMiddleware, doLike)
likeRoute.get("/get-like/:blogid/:userid?", countLike)


export { likeRoute }