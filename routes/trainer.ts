import { Router } from "express";
import {
  deleteTrainerHandler,
  registerHandler,
  updateTrainerHandler,
} from "../handlers";
import { verifyAdminRole } from "../middleware";
import { ROLE } from "../utils";

const router = Router();

router.post("/", verifyAdminRole, (req, res) =>
  registerHandler(req, res, ROLE.TRAINER, "Trainer")
);

router.delete("/", verifyAdminRole, deleteTrainerHandler);
router.put("/", updateTrainerHandler);

export default router;
