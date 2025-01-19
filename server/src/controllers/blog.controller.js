import User from "../models/user.model.js"
import Category from "../models/category.model.js"
import Blog from "../models/blog.model.js"

import cloudinary from "../config/cloudinary.js";
import { handleError } from "../utils/apiErrorHandler.js"
import { encode } from 'entities'

// Add blog
const addBlog = async (req, res, next) => {

    try {
        const data = JSON.parse(req.body.data)
        let featuredImage = ''

        if (req.file) {
            const uploadResult = await cloudinary.uploader
                .upload(
                    req.file.path,
                    { folder: 'blogME', resource_type: 'auto' }

                )
                .catch((error) => {
                    next(handleError(500, "File not Uploaded on cloudinary"))
                });

            featuredImage = uploadResult.secure_url

        }

        // console.log("data", data);
        // console.log("req", req);


        const blog = new Blog({
            author: data.author,
            category: data.category,
            title: data.title,
            slug: data.slug,
            featuredImage: featuredImage,
            blogContent: encode(data.blogContent),
        })

        await blog.save()


        res.status(200).json({
            success: true,
            message: 'Blog added successfully.'
        })



    } catch (error) {
        next(handleError(500, error.message))
    }
}

//edit blog
const editBlog = async (req, res, next) => {

    try {

        const { blogid } = req.params
        const blog = await Blog.findById(blogid).populate('category', 'name')
        if (!blog) {
            next(handleError(404, 'Data not found.'))
        }
        res.status(200).json({
            blog
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

const updateBlog = async (req, res, next) => {

    try {

        const { blogid } = req.params
        const data = JSON.parse(req.body.data)

        // console.log("data", data);


        const blog = await Blog.findById(blogid)

        blog.category = data.category
        blog.title = data.title
        blog.slug = data.slug
        blog.blogContent = encode(data.blogContent)

        let featuredImage = blog.featuredImage


        if (req.file) {
            const uploadResult = await cloudinary.uploader
                .upload(
                    req.file.path,
                    { folder: 'blogME', resource_type: 'auto' }

                )
                .catch((error) => {
                    next(handleError(500, "File not Uploaded on cloudinary"))
                });

            featuredImage = uploadResult.secure_url

        }

        blog.featuredImage = featuredImage

        await blog.save()

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully.'
        })


    } catch (error) {
        next(handleError(500, error.message))
    }
}

// delete Blog
const deleteBlog = async (req, res, next) => {

    try {

        const { blogid } = req.params

        const blog = await Blog.findByIdAndDelete(blogid)

        res.status(200).json({
            success: true,
            message: 'Blog Deleted successfully.',
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

// Disply all blog list
const showAllBlogs = async (req, res, next) => {

    try {
        const user = req.user
        let blog;
        if (user.role === 'admin') {
            blog = await Blog.find().populate('author', 'name avatar role').populate('category', 'name slug').sort({ createdAt: -1 }).lean().exec()
        } else {
            blog = await Blog.find({ author: user._id }).populate('author', 'name avatar role').populate('category', 'name slug').sort({ createdAt: -1 }).lean().exec()
        }
        res.status(200).json({
            blog
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

//Get Blog 
const getBlogPage = async (req, res, next) => {
    try {
        const { slug } = req.params
        const blog = await Blog.findOne({ slug }).populate('author', 'name avatar role').populate('category', 'name slug').lean().exec()

        // console.log("blog", blog);

        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

//Relared blog 
const getRelatedBlog = async (req, res, next) => {

    try {

        const { category, blog } = req.params

        const categoryData = await Category.findOne({ slug: category })
        if (!categoryData) {
            next(handleError(404, "Category Data not found"))
        }

        const categoryId = categoryData._id
        const relatedBlog = await Blog.find({ category: categoryId, slug: { $ne: blog } }).lean().exec()
        res.status(200).json({
            relatedBlog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

//get blog by Category 
const getBlogByCategory = async (req, res, next) => {
    try {
        const { category } = req.params

        const categoryData = await Category.findOne({ slug: category })
        if (!categoryData) {
            return next(404, 'Category data not found.')
        }
        const categoryId = categoryData._id
        const blog = await Blog.find({ category: categoryId }).populate('author', 'name avatar role').populate('category', 'name slug').lean().exec()
        res.status(200).json({
            blog,
            categoryData
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}


//serach
const search = async (req, res, next) => {
    try {
        const { q } = req.query

        const blog = await Blog.find({ title: { $regex: q, $options: 'i' } }).populate('author', 'name avatar role').populate('category', 'name slug').lean().exec()
        res.status(200).json({
            blog,
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}


//get all blog 
const getAllBlogs = async (req, res, next) => {
    try {
        const user = req.user
        const blog = await Blog.find().populate('author', 'name avatar role').populate('category', 'name slug').sort({ createdAt: -1 }).lean().exec()
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}



export {
    addBlog,
    editBlog,
    updateBlog,
    deleteBlog,
    showAllBlogs,
    getBlogPage,
    getRelatedBlog,
    getBlogByCategory,
    search,
    getAllBlogs
}