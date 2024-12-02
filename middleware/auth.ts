import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token =
        req.cookies?.auth_token || req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: No token provided. Please log in.",
        });
      } 

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        role: string;
      };

      if (decoded.role !== requiredRole) {
        res.status(403).json({
          success: false,
          message: `Access denied: ${requiredRole} privileges required.`,
        });
      }

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please log in again.",
      });
    }
  };
};

export const verifyAdminRole = verifyRole("ADMIN");
export const verifyTrainerRole = verifyRole("TRAINER");
export const verifyTraineeRole = verifyRole("TRAINEE");
