import { TaskStatus } from "../generated/prisma";

export interface Assignee {
  id: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  projectId: string;
  assigneeId: string;
  assignee: Assignee;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status?: TaskStatus;
  projectId: string;
  assigneeId: string;
}

export interface CreateTaskRequestBody {
  title: string;
  description: string;
  status?: TaskStatus;
  assigneeId: string;
}

export type UpdateTaskData = Partial<CreateTaskData>;
