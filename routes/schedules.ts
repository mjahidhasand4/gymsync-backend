import { Router } from "express";
import {
  assignTrainerToScheduleHandler,
  joinSchedulesHandler,
  scheduleHandler,
  trainerSchedulesHandler,
} from "../handlers";
import {
  verifyAdminRole,
  verifyTraineeRole,
  verifyTrainerRole,
} from "../middleware";

const router = Router();

router.post("/", verifyAdminRole, scheduleHandler);
router.post("/assign-trainer", verifyAdminRole, assignTrainerToScheduleHandler);
router.get("/:trainerId", verifyTrainerRole, trainerSchedulesHandler);
router.post("/join", verifyTraineeRole, joinSchedulesHandler);

export default router;
