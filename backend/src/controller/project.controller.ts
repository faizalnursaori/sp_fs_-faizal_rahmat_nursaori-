import { Request, Response } from "express";
import {
  handleCreateProject,
  handleGetProjectDetail,
  handleGetProjects,
  handleInviteMember,
  handleDeleteProject,
  handleUpdateProject,
} from "../services/project.service";

export const createProject = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const user = req.user;
  console.log("Create project by user:", req.user);

  if (!name) {
    res.status(400).json({
      message: "Project name is required",
    });
  }

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const project = await handleCreateProject(name, user.id, description);
    res.status(201).json({
      message: "Create project succes",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const getProjectDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user!;

  try {
    const project = await handleGetProjectDetail(id, user.id);
    res.json(project);
  } catch (err) {
    const msg = (err as Error).message;
    if (msg === "PROJECT_NOT_FOUND") {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    if (msg === "FORBIDDEN") {
      res.status(403).json({ message: "You are not a member of this project" });
      return;
    }

    res.status(500).json({ message: "Failed to get project", error: err });
    return;
  }
};

export const getProjects = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const projects = await handleGetProjects(userId);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error });
  }
};

export const inviteMember = async (req: Request, res: Response) => {
  const user = req.user!;
  const projectId = req.params.id;
  const { email } = req.body;

  try {
    const result = await handleInviteMember(projectId, user.id, email);
    res.status(200).json({ message: "User invited", membership: result });
    return;
  } catch (error) {
    const msg = (error as Error).message;

    if (msg === "FORBIDDEN") {
      res.status(403).json({ message: "Only project owner can invite" });
      return;
    }

    if (msg === "USER_NOT_FOUND") {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(500).json({ message: "Failed to invite", error: error });
    return;
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const { name, description } = req.body;

  try {
    const project = await handleUpdateProject(id, user.id, { name, description });
    res.json(project);
  } catch (error) {
    const msg = (error as Error).message;
    if (msg === "FORBIDDEN") {
      res.status(403).json({ message: "Only project owner can update" });
    }

    res.status(500).json({ message: "Failed to update project" });
    return;
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user!;

  try {
    await handleDeleteProject(id, user.id);
    res.json({ message: "Project deleted" });
  } catch (error) {
    const msg = (error as Error).message;

    if (msg === "FORBIDDEN") {
      res.status(403).json({ message: "Only owner can delete" });
      return;
    }

    res.status(500).json({ message: "Failed to delete project" });
    return;
  }
};
