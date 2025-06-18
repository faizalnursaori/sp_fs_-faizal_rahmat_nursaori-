// lib/types.ts

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: User;
  members?: ProjectMember[];
  tasks?: Task[];
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: "owner" | "member";
  invitedAt: string;
  joinedAt?: string;
  user?: User;
  project?: Project;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  projectId: string;
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
  assignee?: User;
  project?: Project;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
