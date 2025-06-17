import { createProject, getProjectsByUser } from "../repositories/project.repository";
import { inviteMember, isOwnerProject } from "../repositories/membership.repository";
import { findUserByEmail } from "../repositories/user.repository";

export const handleCreateProject = async (name: string, ownerId: string) => {
  return createProject(name, ownerId);
};

export const handleGetProjects = async (userId: string) => {
  return getProjectsByUser(userId);
};

export const handleInviteMember = async (projectId: string, ownerId: string, email: string) => {
  const isOwner = await isOwnerProject(projectId, ownerId);
  if (!isOwner) throw new Error("FORBIDDEN");

  const user = await findUserByEmail(email);
  if (!user) throw new Error("USER_NOT_FOUND");

  const membership = await inviteMember(projectId, user.id);
  return membership;
};
