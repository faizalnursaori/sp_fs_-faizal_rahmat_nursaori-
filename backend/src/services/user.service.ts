import { UpdateUserData } from "../../types/user";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../repositories/user.repository";
import bcrypt from "bcrypt";

export const handleGetUsers = async () => {
  return getAllUsers();
};

export const handleGetMe = async (id: string) => {
  if (!id) {
    throw new Error("User ID is required");
  }

  const user = await getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const handleUpdateUser = async (id: string, data: UpdateUserData) => {
  const { email, password } = data;
  const updateData: Partial<UpdateUserData> = {};

  if (email) updateData.email = email;
  if (password) {
    try {
      updateData.password = await bcrypt.hash(password, 10);
    } catch {
      throw new Error("Failed to hash password");
    }
  }

  return updateUser(id, updateData);
};

export const handleDeleteUser = async (id: string) => {
  const user = await getUserById(id);

  if (!user) {
    throw new Error("User not found");
  }

  return deleteUser(id);
};
