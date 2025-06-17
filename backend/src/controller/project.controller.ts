import { Request, Response } from "express";
import { handleCreateProject, handleGetProjects } from "../services/project.service";

export const createProject = async (req: Request, res: Response) => {
  const { name } = req.body;
  const user = req.user;

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
    const project = await handleCreateProject(name, user.id);
    res.status(201).json({
      message: "Create project succes",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  const user = req.user!;

  try {
    const projects = await handleGetProjects(user.id);
    res.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({
      message: "Failed to get projects",
    });
  }
};
