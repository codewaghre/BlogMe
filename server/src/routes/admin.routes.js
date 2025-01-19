import { Router } from "express";
import { onlyAdmin } from "../middlewares/admin.middleware.js";
import { addAdmin, allAdmin, deleteAdmin } from "../controllers/admin.controller.js";

const adminRoute = Router()

adminRoute.post("/add", addAdmin)
adminRoute.get("/get-admin", allAdmin)
adminRoute.delete("/delete/:id", deleteAdmin)

export { adminRoute }