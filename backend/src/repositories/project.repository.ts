import prisma from "../prisma";

export const createProject = async (name: string, ownerId: string) => {
  if (!ownerId) throw new Error("ownerId is required");

  return prisma.project.create({
    data: {
      name,
      ownerId,
      memberships: {
        create: {
          userId: ownerId,
        },
      },
    },
  });
};

export const getProjectById = async (projectId: string) => {
  return prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      memberships: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const updateProject = async (projectId: string, data: { name: string }) => {
  return prisma.project.update({
    where: {
      id: projectId,
    },
    data,
  });
};

export const deleteProject = async (projectId: string) => {
  return prisma.project.delete({
    where: {
      id: projectId,
    },
  });
};
