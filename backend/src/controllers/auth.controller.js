import { UserModel } from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { generateToken } from "../utils/gen.jwt.js"
import cloudinary from "../utils/cloudinary.js"
import { sendEmail } from "../utils/mailer.js"

export const signupController = async (req, res) => {
    try {
        const { fullName, email, password } = req.body
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }
        const user = await UserModel.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = await UserModel.create({
            fullName,
            email,
            password: hashedPassword
        })

        if (!newUser) {
            return res.status(400).json({ message: "Invalid user data" });
        }

        await sendEmail({ email: newUser.email, emailType: "VERIFY", userId: newUser._id })
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        })
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        if (!user.isVerified) {
            await sendEmail({ email: user.email, emailType: "VERIFY", userId: user._id })
            return res.status(400).json({ message: "Email not verified Please Verify!" })
        }
        const token = generateToken(user._id)
        res.status(200).cookie("authToken", token, {
            httpOnly: true,
            secure: false, //change in prod
            sameSite: 'Strict', // change
            maxAge: 24 * 60 * 60 * 1000,
        }).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            token
        })

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const logoutController = async (req, res) => {
    try {
        res.cookie("authToken", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const updateProfileController = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );
        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in update controller", error);
        res.status(500).json({ message: error.message });
    }
}

export const checkAuthController = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: error.message });
    }
}


export const verifyEmailContoller = async (req, res) => {
    try {
        const { token } = req.body

        if (!token) {
            return res.status(400).json({ message: "Token is required" })
        }

        const user = await UserModel.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } })

        if (!user) {
            return res.status(400).json({ error: "Invalid token" })
        }

        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined
        await user.save()

        return res.status(200).json({ message: "Email verified successfully", success: true })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ error: "Email is required" })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        await sendEmail({ email, emailType: "FORGOT", userId: user._id })

        return res.status(200).json({ message: "Email sent successfully" })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const changePasswordController = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body

        if (!token) {
            return res.status(400).json({ errors: "Token is required" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password does not match" })
        }

        const user = await UserModel.findOne({ forgotPasswordToken: token, forgotPasswordTokenExpiry: { $gt: Date.now() } })

        if (!user) {
            return res.status(400).json({ error: "Invalid token" })
        }

        const hashedPassword = await bcryptjs.hash(password,10)
        user.password = hashedPassword
        user.forgotPasswordToken = undefined
        user.forgotPasswordTokenExpiry = undefined
        await user.save()

        return res.status(200).json({ message: "Password changed successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}