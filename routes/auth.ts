import { Router, type Request, type Response } from "express";
import { loginHandler, registerHandler } from "../handlers";
import { ROLE } from "../utils";

const router = Router();

router.post("/register", async (req, res) => {
  await registerHandler(req, res, ROLE.TRAINEE, "User");
});

router.post("/login", async (req: Request, res: Response) => {
  await loginHandler(req, res);
});

export default router;
