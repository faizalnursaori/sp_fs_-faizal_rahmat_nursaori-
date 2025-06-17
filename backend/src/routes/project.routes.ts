import { Router } from "express";
import { createProject, getProjects } from "../controller/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);

export default router;
