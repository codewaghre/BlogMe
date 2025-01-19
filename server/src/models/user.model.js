import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    googleEmail: { type: String, unique: true, sparse: true },
    bio: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
})

// Bcrypt Password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// Name Update
userSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        console.log("Name has been modified:", this.name);

        //  if you want Add your custom logic here like length etc....
        // Example: Capitalize the first letter of the name
        this.name = this.name

        // Example: Log the change
        console.log("Updated name to:", this.name);
    }
    next();
});

//Check Password correct or not
userSchema.methods.isPasswordVaild = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        role: this.role
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

const User = mongoose.model('User', userSchema, 'users')
export default User 