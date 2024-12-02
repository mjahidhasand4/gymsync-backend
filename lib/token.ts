import jwt from "jsonwebtoken";

export const generateToken = (userId: string, role: string): string => {
  const payload = { userId, role };
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const options = { expiresIn: "1h" };

  return jwt.sign(payload, secret, options);
};
