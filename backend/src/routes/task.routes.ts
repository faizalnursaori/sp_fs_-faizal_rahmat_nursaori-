import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createTask, getTasks, updateTask, deleteTask } from "../controller/task.controller";

const router = Router();

router.post("/:projectId/tasks", authMiddleware, createTask);
router.get("/:projectId/tasks", authMiddleware, getTasks);
router.patch("/task/:taskId", authMiddleware, updateTask);
router.delete("/task/:taskId", authMiddleware, deleteTask);

export default router;
