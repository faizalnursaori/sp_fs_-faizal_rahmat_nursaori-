import { Router } from "express";
import {
  createProject,
  inviteMember,
  getProjectDetail,
  updateProject,
  deleteProject,
  getProjects,
} from "../controller/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createProject);
router.post("/:id/invite", authMiddleware, inviteMember);
router.get("/:id", authMiddleware, getProjectDetail);
router.get("/", authMiddleware, getProjects);
router.patch("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;
