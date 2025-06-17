import prisma from "../prisma";
import { User } from "../../generated/prisma";
import { CreateUserData } from "../../types/user";

export const findUserByEmail = (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = (userData: CreateUserData) => {
  return prisma.user.create({
    data: userData,
  });
};
