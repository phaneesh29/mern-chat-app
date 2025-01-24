import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { signupController, loginController, logoutController, updateProfileController, checkAuthController, verifyEmailContoller, forgotPasswordController, changePasswordController } from "../controllers/auth.controller.js"

const router = Router()

router.post("/signup", signupController)
router.post("/login", loginController)
router.post("/logout", logoutController)

router.put("/update-profile", protectRoute, updateProfileController)

router.get("/check", protectRoute, checkAuthController)

router.post("/verifyemail",verifyEmailContoller)

router.post("/forgot",forgotPasswordController)

router.post("/change",changePasswordController)

export default router