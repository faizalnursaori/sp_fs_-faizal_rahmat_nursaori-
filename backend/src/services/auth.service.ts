import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateUserData, LoginUserData, UserResponse } from "../../types/user";
import { findUserByEmail, createUser } from "../repositories/user.repository";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (userData: CreateUserData): Promise<UserResponse> => {
  const { email, password } = userData;
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error("EMAIL_EXIST");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({
    email,
    password: hashedPassword,
  });

  return {
    id: user.id,
    email: user.email,
  };
};

export const loginUser = async (loginData: LoginUserData) => {
  const { email, password } = loginData;
  const user = await findUserByEmail(email);
  if (!user) throw new Error("USER_NOT_FOUND");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("INVALID_CREDENTIALS");

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    token,
  };
};
