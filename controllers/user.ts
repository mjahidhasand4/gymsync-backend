import { prisma } from "../lib";
import { ROLE } from "../utils";

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: ROLE
) => {
  try {
    const newUser = await prisma?.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });

    return newUser;
  } catch (error) {
    console.log("🚀 ~ error creating new user:", error);
    return null;
  }
};

export const findUserById = async (id: string) => {
  try {
    const user = await prisma?.user.findUnique({
      where: {
        id,
      },
    });

    if (user) return user;

    return null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error("Error checking user existence. Please try again.");
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    const user = await prisma?.user.findUnique({
      where: {
        email,
      },
    });

    if (user) return user;

    return null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error("Error checking user existence. Please try again.");
  }
};

export const updateUser = async (
  id: string,
  data: Partial<{ name: string; email: string; password: string }>
) => {
  return await prisma?.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: string) => {
  return await prisma?.user.delete({ where: { id } });
};
