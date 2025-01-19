import Category from "../models/category.model.js"
import { handleError } from "../utils/apiErrorHandler.js";

const addCategory = async (req, res, next) => {
    try {
        const { name, slug } = req.body
        const category = new Category({
            name, slug
        })

        await category.save()

        res.status(200).json({
            success: true,
            message: 'Category added successfully.'
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

const showCategory = async (req, res, next) => {
    try {
        const { categoryid } = req.params

        if (!categoryid) {
            next(handleError(404, "Category ID not found"))
        }

        const category = await Category.findById(categoryid)
        if (!category) {
            next(handleError(404, 'Data not found.'))
        }

        res.status(200).json({
            success: true,
            message: 'Category Data Sent successfully.',
            category
        })


    } catch (error) {
        next(handleError(500, error.message))
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const { categoryid } = req.params
        const { name, slug } = req.body

        if (!categoryid) {
            next(handleError(404, "Category ID not found"))
        }

        if (!name && !slug) {
            next(handleError(404, "All fields are required"))
        }

        const category = await Category.findByIdAndUpdate(categoryid, {
            name, slug
        }, { new: true, runValidators: true })


        res.status(200).json({
            success: true,
            message: 'Category updated successfully.',
            category
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        const { categoryid } = req.params
        if (!categoryid) {
            next(handleError(404, "Category ID not found"))
        }

        const data = await Category.findByIdAndDelete(categoryid)
        if (!data) {
            next(handleError(404, "Try again"))
        }

        res.status(200).json({
            success: true,
            message: 'Category Deleted successfully.',
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

const getAllCategory = async (req, res, next) => {
    try {
        const category = await Category.find().sort({ name: 1 }).lean().exec()
        res.status(200).json({
            category
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export {
    addCategory,
    updateCategory,
    showCategory,
    deleteCategory,
    getAllCategory
}