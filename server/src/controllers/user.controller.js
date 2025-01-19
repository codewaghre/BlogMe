import User from "../models/user.model.js";
import { handleError } from "../utils/apiErrorHandler.js";
import cloudinary from "../config/cloudinary.js";

const getUser = async (req, res, next) => {
    try {

        // console.log(req.params.id);
        const { id } = req.params

        const user = await User.findById(id).lean().exec();
        // console.log("user", user);

        if (!user) {
            next(handleError(404, "User not found!"))
        }

        res.status(200).json({
            success: true,
            message: "User Data Found",
            user
        })
    } catch (error) {
        next(handleError(500, error.message))
    }

}

const updateUser = async (req, res, next) => {

    try {
        const { id } = req.params
        const data = JSON.parse(req.body.data);
        const file = req.file



        const user = await User.findById(id)
        if (!user) {
            next(handleError(404, "User not found"))
        }
        user.name = data.name
        user.bio = data.bio

        if (req.file) {
            const uploadResult = await cloudinary.uploader
                .upload(
                    req.file.path,
                    { folder: 'blogME', resource_type: 'auto' }

                )
                .catch((error) => {
                    next(handleError(500, "File not Uploaded on cloudinary"))
                });

            user.avatar = uploadResult.secure_url

        }
        await user.save({ validateBeforeSave: false })

        const newUser = user.toObject({ getters: true })
        delete newUser.password
        res.status(200).json({
            success: true,
            message: 'Data updated.',
            user: newUser
        })
    } catch (error) {
        next(handleError(500, error.message))
    }


}

const getAllUser = async (req, res, next) => {
    try {
        const user = await User.find().sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'Data deleted.'
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}


export {
    getUser,
    updateUser,
    getAllUser,
    deleteUser
}