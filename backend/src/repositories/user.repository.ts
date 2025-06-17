import prisma from "../prisma";
import { User } from "../../generated/prisma";
import { CreateUserData, UpdateUserData } from "../../types/user";

export const findUserByEmail = (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
};

export const updateUser = async (id: string, data: UpdateUserData) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};

export const createUser = (userData: CreateUserData) => {
  return prisma.user.create({
    data: userData,
  });
};
