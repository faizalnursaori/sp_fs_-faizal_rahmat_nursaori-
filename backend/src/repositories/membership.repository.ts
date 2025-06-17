import prisma from "../prisma";

export const inviteMember = async (projectId: string, userId: string) => {
  return prisma.membership.create({
    data: {
      projectId,
      userId,
    },
  });
};

export const isOwnerProject = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });
  return project?.ownerId === userId;
};
