import User from "../models/user.model.js";
import { handleError } from "../utils/apiErrorHandler.js";


const addAdmin = async (req, res, next) => {

    try {


        const { name, email, password } = req.body

        // Check for all fields are empty or not
        if ([name, email, password].some(field => field.trim() === "")) {
            next(handleError(409, 'All fields are required'))
        }

        const checkUser = await User.findOne({ email })
        if (checkUser) {
            next(handleError(409, "User or Email already exists"))
        }

        const user = await User.create({
            name,
            email,
            password,
            role: "admin"
        })

        const createdUser = await User.findById(user._id).select(
            "-password "
        )

        if (!createdUser) {
            next(handleError(500, "Something went wrong while registering the user"))
        }

        res.status(200).json({
            success: true,
            message: " Registration Scuessfull",
            data: createdUser
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}


const allAdmin = async (req, res, next) => {

    try {

        const admin = await User.find({ role: 'admin' }).sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            message: " Registration admin Scuessfull",
            data: admin
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

const deleteAdmin = async (req, res, next) => {

    try {
        const { id } = req.params
        await User.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: "admin  Delete  Scuessfull",
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}


export {
    addAdmin,
    allAdmin,
    deleteAdmin
}