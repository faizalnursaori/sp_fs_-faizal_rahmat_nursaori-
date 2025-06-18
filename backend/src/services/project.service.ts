import prisma from "../prisma";
import {
  createProject,
  getProjectById,
  getProjectsByUser,
  updateProject,
  deleteProject,
} from "../repositories/project.repository";
import { inviteMember, isOwnerProject } from "../repositories/membership.repository";
import { findUserByEmail } from "../repositories/user.repository";

export const handleCreateProject = async (name: string, ownerId: string, description: string) => {
  return createProject(name, ownerId, description);
};

export const handleGetProjectDetail = async (projectId: string, userId: string) => {
  const project = await getProjectById(projectId);
  if (!project) throw new Error("PROJECT_NOT_FOUND");

  const isMember = await prisma.membership.findFirst({
    where: { projectId, userId },
  });

  if (!isMember) throw new Error("FORBIDDEN");

  return project;
};

export const handleGetProjects = async (userId: string) => {
  return getProjectsByUser(userId);
};

export const handleUpdateProject = async (
  projectId: string,
  userId: string,
  data: { name: string; description: string }
) => {
  const isOwner = await isOwnerProject(projectId, userId);
  if (!isOwner) throw new Error("FORBIDDEN");

  return updateProject(projectId, data);
};

export const handleInviteMember = async (projectId: string, ownerId: string, email: string) => {
  const isOwner = await isOwnerProject(projectId, ownerId);
  if (!isOwner) throw new Error("FORBIDDEN");

  const user = await findUserByEmail(email);
  if (!user) throw new Error("USER_NOT_FOUND");

  const membership = await inviteMember(projectId, user.id);
  return membership;
};

export const handleDeleteProject = async (projectId: string, userId: string) => {
  const isOwner = await isOwnerProject(projectId, userId);
  if (!isOwner) throw new Error("FORBIDDEN");

  return deleteProject(projectId);
};
