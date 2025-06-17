import { Router } from "express";
import { createProject, getProjects, inviteMember } from "../controller/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.post("/:id/invite", authMiddleware, inviteMember);

export default router;
