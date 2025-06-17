import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getUsers, getMe, updateUser, deleteUser } from "../controller/user.controller";

const router = Router();

router.get("/", authMiddleware, getUsers);
router.get("/me", authMiddleware, getMe);
router.patch("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
