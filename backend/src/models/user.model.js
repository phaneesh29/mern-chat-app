import { Schema, model } from "mongoose";
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
        type: String,
        default: "http://localhost:8080/public/default.webp",
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyToken: String,
    verifyTokenExpiry: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date
}, { timestamps: true })

export const UserModel = model("User", userSchema)