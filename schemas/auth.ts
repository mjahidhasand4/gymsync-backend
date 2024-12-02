import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Enter a name" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(6, { message: "Enter your password" }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
