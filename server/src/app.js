import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { notFound, errorHandler } from "./middlewares/error.middleware.js"

import { authRoute } from './routes/auth.routes.js'
import { userRoute } from './routes/user.routes.js'
import { categoryRoute } from './routes/category.routes.js'
import { blogRoute } from './routes/blog.routes.js'
import { commentRoute } from './routes/comment.routes.js'
import { likeRoute } from './routes/like.routes.js'
import { adminRoute } from './routes/admin.routes.js'


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

//Auth Route
app.use("/api/auth", authRoute)

//User Route
app.use("/api/user", userRoute)

//Category Route
app.use("/api/category", categoryRoute)

//Blog Route
app.use("/api/blog", blogRoute)

//Comment Route
app.use("/api/comment", commentRoute)

//Like Routwe
app.use("/api/blog-like", likeRoute)

//admin Route
app.use("/api/admin", adminRoute)


// Testing route
app.get("/", (req, res) => {
    res.send("Hello, connected!");
});


//error handler
app.use(notFound)
app.use(errorHandler)



export { app }