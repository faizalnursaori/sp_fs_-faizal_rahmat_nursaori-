import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await registerUser({ email, password });
    res.status(201).json({
      message: "User created",
      user,
    });
  } catch (error) {
    if ((error as Error).message === "EMAIL_EXIST") {
      res.status(400).json({ message: "Email already registered" });
      return;
    }
    res.status(500).json({ message: "Server Error" });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser({ email, password });
    res.json(result);
  } catch (error) {
    if ((error as Error).message === "USER_NOT_FOUND") {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if ((error as Error).message === "INVALID_CREDENTIALS") {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    res.status(500).json({ message: "Server Error" });
    return;
  }
};
