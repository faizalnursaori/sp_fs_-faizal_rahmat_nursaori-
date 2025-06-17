import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../../types/user";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded as JwtPayload;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
