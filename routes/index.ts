import { type Application } from "express";
import authRoutes from "./auth";
import trainerRoutes from "./trainer";
import scheduleRoutes from "./schedules";

export const routes = (app: Application) => {
  app.use("/auth", authRoutes);
  app.use("/trainer", trainerRoutes);
  app.use("/schedules", scheduleRoutes);
};
