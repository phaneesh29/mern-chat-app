export const PORT = process.env.PORT || 3030

export const DB_NAME = "chatie"
export const MONGO_URI = process.env.MONGO_URI

export const ORIGIN_DOMAIN = process.env.ORGIN


export const mailerHtml = (emailType,hashedToken) => {
    if (emailType === "VERIFY") {
        return `<p>Click <a href="${process.env.ORGIN}/verifyemail?token=${hashedToken}">here</a> to verify your email
            or copy and paste the link below in your browser. <br> ${process.env.ORGIN}/verifyemail?token=${hashedToken}
            </p>`
    } else if (emailType === "FORGOT") {
        return `<p>Click <a href="${process.env.ORGIN}/changepassword?token=${hashedToken}">here</a> to reset your password
    or copy and paste the link below in your browser. <br> ${process.env.ORGIN}/changepassword?token=${hashedToken}
    </p>`
    } else if (emailType === "PROMO") {
        return `<p>This <a href="${process.env.ORGIN}">here</a> to remind you about our chat app
        or copy and paste the link below in your browser. <br> ${process.env.ORGIN}</p>`
    }
}

export const mailerSubject = (emailType) => {
    if (emailType === "VERIFY") {
        return `Verify Your Account`
    } else if (emailType === "FORGOT") {
        return `Forgot Your password | Change Here`
    } else if (emailType === "PROMO") {
        return `Just a small reminder`
    }
}
