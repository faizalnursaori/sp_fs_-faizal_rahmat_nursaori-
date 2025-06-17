import { createProject, getProjectsByUser } from "../repositories/project.repository";

export const handleCreateProject = async (name: string, ownerId: string) => {
  return createProject(name, ownerId);
};

export const handleGetProjects = async (userId: string) => {
  return getProjectsByUser(userId);
};
