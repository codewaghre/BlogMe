import { Router } from "express";
import { addCategory, updateCategory, showCategory, deleteCategory, getAllCategory } from "../controllers/category.controller.js"
import { onlyAdmin } from '../middlewares/admin.middleware.js'

const categoryRoute = Router()

categoryRoute.post('/add', onlyAdmin, addCategory)
categoryRoute.put('/update/:categoryid', onlyAdmin, updateCategory)
categoryRoute.get('/show/:categoryid', onlyAdmin, showCategory)
categoryRoute.delete('/delete/:categoryid', onlyAdmin, deleteCategory)

categoryRoute.get('/all-category', getAllCategory)

export { categoryRoute }