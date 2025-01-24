import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { deleteMessageController, getMessageController, getUsersForSidebarController, sendMessageController } from "../controllers/message.controller.js";

const router = Router()

router.get("/users", protectRoute, getUsersForSidebarController)
router.get("/:id", protectRoute, getMessageController)

router.post("/send/:id", protectRoute, sendMessageController)

router.delete("/delete/:id", protectRoute, deleteMessageController)

export default router