import prisma from "../prisma";
import { Task, CreateTaskData, UpdateTaskData } from "../../types/tasks";

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  return prisma.task.create({
    data,
    include: {
      assignee: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const getTasksByProject = async (projectId: string) => {
  return prisma.task.findMany({
    where: {
      projectId,
    },
    include: {
      assignee: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const updateTask = async (taskId: string, data: UpdateTaskData): Promise<Task> => {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data,
    include: {
      assignee: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
};

export const deleteTask = async (taskId: string) => {
  return prisma.task.delete({
    where: {
      id: taskId,
    },
  });
};
