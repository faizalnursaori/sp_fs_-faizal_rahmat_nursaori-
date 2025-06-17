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

export const getProjectsByUser = async (userId: string) => {
  return prisma.project.findMany({
    where: {
      memberships: {
        some: {
          userId,
        },
      },
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
