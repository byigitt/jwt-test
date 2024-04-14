import { Router } from "express";

import authRouter from "./auth/index.js";
import userRouter from "./user/index.js";

const router = Router();
router.use("/api/auth", authRouter);
router.use("/api/user", userRouter);

export default router;
