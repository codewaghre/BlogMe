
import User from "../models/user.model.js"
import { handleError } from "../utils/apiErrorHandler.js"


//Genrate Acces Token
const generateAccessToken = async function (userID) {

    try {
        const user = await User.findById(userID)
        const accessToken = user.generateAccessToken()

        return accessToken
    } catch (error) {
        console.log("error in generateAccessToken: -", error, error.message);

    }
}

// Register Contorller
const registerUser = async (req, res, next) => {

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

//Login Controller
const loginUser = async (req, res, next) => {
    const { email, password, } = req.body

    // Check for all fields are empty or not
    if ([email, password].some(field => field.trim() === "")) {
        next(handleError(409, 'All fields are required'))
    }


    let user = await User.findOne({ email })

    if (!user) {
        next(handleError(409, "User does't exits"))
    }

    const ispasswordVaild = await user.isPasswordVaild(password)

    if (!ispasswordVaild) {
        next(handleError(401, "Invaild User Credentitals"))
    }

    const loggedInUser = await User.findById(user._id).select("-password ")

    const accessToken = await generateAccessToken(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .json({
            success: true,
            message: "Login in Sucessfully",
            user: loggedInUser
        })
}

//google Login Contorller
const googleLogin = async (req, res, next) => {

    try {
        const { email, name, avatar } = req.body


        if ([email, name].some((field) => field.trim() === "")) {
            next(handleError(409, "All fields are required"))
        }

        let user = await User.findOne({ email })
        // console.log("user", user);


        if (!user) {

            let password = Math.random().toString()
            const newUser = new User({
                name, email, avatar, googleEmail: email
            })

            user = await newUser.save()
            // console.log("newUser", newUser);


        }
        const userme = await User.findOne({ email })
        // console.log("user ME", userme);


        const accessToken = await generateAccessToken(userme._id)
        //toObject is use to manipulate moogse schmea into plan object
        const newUser = user.toObject({ getters: true })
        delete newUser.password

        const options = {
            httpOnly: true,
            secure: true
        }

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .json({
                success: true,
                user: newUser,
                message: 'Login successful.'
            })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

//Logout Contorller
const logoutUser = async (req, res, next) => {

    try {

        const options = {
            httpOnly: true,
            secure: true
        }

        res.status(200)
            .clearCookie("accesToken", options).json({
                success: true,
                user: {},
                message: "Log-out Successfully"

            })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

//forgot password 
const resetPassword = async (req, res, next) => {

    const { newPassword, oldPassword } = req.body

    if (!newPassword && !oldPassword) {
        next(handleError(404, "All fields are required"))
    }
    const id = req.user._id

    const user = await User.findById(id)

    if (!user) {
        next(handleError(404, "User not Found"))
    }

    const isVaild = await user.isPasswordVaild(oldPassword)
    if (!isVaild) {
        next(handleError(400, "Old password is incorrect"))
    }

    const accessToken = await generateAccessToken(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    user.password = newPassword
    await user.save()

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .json({
            success: true,
            message: 'Password reset successfully',
        })


}


export {
    registerUser,
    loginUser,
    googleLogin,
    logoutUser,
    resetPassword
}