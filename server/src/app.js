import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from "dotenv";
import connectDB from "./db/connect.db.js";

import { notFound, errorHandler } from "./middlewares/error.middleware.js"

import { authRoute } from './routes/auth.routes.js'
import { userRoute } from './routes/user.routes.js'
import { categoryRoute } from './routes/category.routes.js'
import { blogRoute } from './routes/blog.routes.js'
import { commentRoute } from './routes/comment.routes.js'
import { likeRoute } from './routes/like.routes.js'
import { adminRoute } from './routes/admin.routes.js'

// Setup dotenv
dotenv.config({
    path: './.env'
});

const port = process.env.PORT


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// connect database
connectDB()

app.get("/", (req, res) => {
    res.send("Server is Running ")
})

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
app.get("/test", (req, res) => {
    res.send("Hello, connected!");
});

// Ignore favicon requests
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // No content
});


//error handler
app.use(notFound)
app.use(errorHandler)


app.listen(port, () => {
    console.log(`Express is working on http://localhost:${port}`);
});



export { app }