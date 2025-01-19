import { Router } from "express";
import { addBlog, deleteBlog, updateBlog, showAllBlogs, editBlog, getBlogPage, getRelatedBlog, getBlogByCategory, search, getAllBlogs } from "../controllers/blog.controller.js";
import upload from "../config/multer.js";
import { authMiddleware } from '../middlewares/auth.middleare.js'

const blogRoute = Router()

blogRoute.post('/add', authMiddleware, upload.single('file'), addBlog)
blogRoute.get('/edit/:blogid', authMiddleware, editBlog)
blogRoute.put('/update/:blogid', authMiddleware, upload.single('file'), updateBlog)
blogRoute.delete('/delete/:blogid', authMiddleware, deleteBlog)
blogRoute.get('/all-blogs', authMiddleware, showAllBlogs)


blogRoute.get("/get-blog/:slug", getBlogPage)
blogRoute.get("/get-related-blog/:category/:blog", getRelatedBlog)
blogRoute.get("/get-blog-by-category/:category", getBlogByCategory)
blogRoute.get("/search", search)

blogRoute.get("/blogs", getAllBlogs)

export { blogRoute }