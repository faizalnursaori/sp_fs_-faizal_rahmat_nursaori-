import prisma from "../prisma";
import { TaskStatus } from "../../generated/prisma";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} from "../repositories/task.repository";
import { Task, CreateTaskRequestBody, CreateTaskData, UpdateTaskData } from "../../types/tasks";

export const handleCreateTask = async (
  projectId: string,
  userId: string,
  body: CreateTaskRequestBody
): Promise<Task> => {
  const { title, description, status = TaskStatus.TODO, assigneeId } = body;

  const isMember = await prisma.membership.findFirst({
    where: {
      userId,
      projectId,
    },
  });

  if (!isMember) throw new Error("FORBIDDEN");

  const assigneeIsMember = await prisma.membership.findFirst({
    where: {
      userId: assigneeId,
      projectId,
    },
  });

  if (!assigneeIsMember) throw new Error("ASSIGNEE_INVALID");

  const taskData: CreateTaskData = {
    title,
    description,
    status,
    projectId,
    assigneeId,
  };

  return createTask(taskData);
};

export const handleGetTasks = async (projectId: string, userId: string): Promise<Task[]> => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) throw new Error("PROJECT_NOT_FOUND");

  const isMember = await prisma.membership.findFirst({
    where: { projectId, userId },
  });

  if (!isMember) throw new Error("FORBIDDEN");

  return getTasksByProject(projectId);
};

export const handleUpdateTask = async (taskId: string, data: UpdateTaskData): Promise<Task> => {
  const existingTask = await prisma.task.findUnique({ where: { id: taskId } });

  if (!existingTask) {
    throw new Error("TASK_NOT_FOUND");
  }

  return updateTask(taskId, data);
};

export const handleDeleteTask = async (taskId: string): Promise<void> => {
  const existingTask = await prisma.task.findUnique({ where: { id: taskId } });

  if (!existingTask) {
    throw new Error("TASK_NOT_FOUND");
  }

  await deleteTask(taskId);
};
