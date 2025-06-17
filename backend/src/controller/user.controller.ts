import { Request, Response } from "express";
import {
  handleGetUsers,
  handleGetMe,
  handleUpdateUser,
  handleDeleteUser,
} from "../services/user.service";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await handleGetUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await handleGetMe(req.user!.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get profile" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updated = await handleUpdateUser(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await handleDeleteUser(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
