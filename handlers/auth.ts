import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../schemas";
import { ROLE } from "../utils";
import { createUser, findUserByEmail } from "../controllers";
import { compare, hash } from "bcrypt";
import { generateToken, validateRequestBody } from "../lib";

export const registerHandler = async (
  req: Request,
  res: Response,
  role: ROLE,
  roleName: string
) => {
  const isValid = validateRequestBody(registerSchema, req, res);
  if (!isValid) return;

  const { name, email, password } = req.body;
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    res.status(409).json({
      success: false,
      message: `${roleName} already exists`,
    });

    return;
  }

  const hashedPassword = await hash(password, 10);
  const newUser = await createUser(name, email, hashedPassword, role);

  if (newUser) {
    res.status(201).json({
      success: true,
      message: `${roleName} created successfully!`,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Server side error",
  });
};

export const loginHandler = async (req: Request, res: Response) => {
  const isValid = validateRequestBody(loginSchema, req, res);
  if (!isValid) return;

  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });

    return;
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    res.status(401).json({
      success: false,
      message: "Password doesn't match",
    });

    return;
  }

  const token = generateToken(user.id, user.role);

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000,
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
  });
};
