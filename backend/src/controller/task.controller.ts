import { Request, Response } from "express";
import {
  handleCreateTask,
  handleGetTasks,
  handleUpdateTask,
  handleDeleteTask,
} from "../services/task.service";

export const createTask = async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const userId = req.user!.id;

  try {
    const task = await handleCreateTask(projectId, userId, req.body);
    res.status(201).json(task);
  } catch (error) {
    const msg = (error as Error).message;

    if (msg === "FORBIDDEN") {
      res.status(403).json({ message: "Not a project member" });
      return;
    }

    if (msg === "ASSIGNEE_INVALID") {
      res.status(400).json({ message: "Assignee is not a member of this project" });
      return;
    }

    res.status(500).json({ message: "Failed to create task" });
    return;
  }
};

export const getTasks = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const userId = req.user!.id;

  try {
    const tasks = await handleGetTasks(projectId, userId);
    res.json(tasks);
  } catch (error) {
    const msg = (error as Error).message;

    if (msg === "PROJECT_NOT_FOUND") {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    if (msg === "FORBIDDEN") {
      res.status(403).json({ message: "Not a project member" });
      return;
    }

    res.status(500).json({ message: "Failed to get tasks" });
    return;
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await handleUpdateTask(req.params.taskId, req.body);
    res.json(task);
  } catch (error) {
    const msg = (error as Error).message;

    if (msg === "TASK_NOT_FOUND") {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(500).json({ message: "Failed to update task" });
    return;
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    await handleDeleteTask(req.params.taskId);
    res.json({ message: "Task deleted" });
  } catch (error) {
    const msg = (error as Error).message;

    if (msg === "TASK_NOT_FOUND") {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(500).json({ message: "Failed to delete task" });
    return;
  }
};
