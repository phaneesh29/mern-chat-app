import nodemailer from "nodemailer";
import { UserModel } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { mailerHtml, mailerSubject } from "../constant.js";

export const sendEmail = async ({ email, emailType, userId }) => {

    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await UserModel.findByIdAndUpdate(userId, { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 });
        } else if (emailType === "FORGOT") {
            await UserModel.findByIdAndUpdate(userId, { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 });
        }

        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: mailerSubject(emailType),
            html: mailerHtml(emailType,hashedToken)
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};