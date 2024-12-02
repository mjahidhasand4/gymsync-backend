import { Request, Response } from "express";
import {
  deleteUser,
  findUserByEmail,
  findUserById,
  updateUser,
} from "../controllers";
import { ROLE } from "../utils";
import { hash } from "bcrypt";

export const deleteTrainerHandler = async (req: Request, res: Response) => {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    res.status(400).json({
      success: false,
      message: "Trainer ID is required as a query parameter",
    });
    return;
  }

  try {
    const trainer = await findUserById(id);
    if (!trainer || trainer.role !== ROLE.TRAINER) {
      res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
      return;
    }

    const deletedTrainer = await deleteUser(id);

    res.status(200).json({
      success: true,
      message: "Trainer deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server side error",
    });
  }
};

export const updateTrainerHandler = async (req: Request, res: Response) => {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    res.status(400).json({
      success: false,
      message: "Trainer ID is required as a query parameter",
    });
    return;
  }

  const { name, email, password } = req.body;

  try {
    const trainer = await findUserById(id);
    if (!trainer || trainer.role !== ROLE.TRAINER) {
      res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
      return;
    }

    if (email && email !== trainer.email) {
      const existingEmail = await findUserByEmail(email);
      if (existingEmail) {
        res.status(409).json({
          success: false,
          message: "Email already in use",
        });
        return;
      }
    }

    let hashedPassword = trainer.password;
    if (password) {
      hashedPassword = await hash(password, 10);
    }

    const updatedTrainer = await updateUser(id, {
      name: name || trainer.name,
      email: email || trainer.email,
      password: hashedPassword,
    });

    res.status(200).json({
      success: true,
      message: "Trainer updated successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server side error",
    });
  }
};
