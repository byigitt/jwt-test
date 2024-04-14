import { Router } from "express";
import Auth from "../../../controllers/Auth.js";

const router = Router();

router.post("/login", Auth.login);
router.post("/register", Auth.register);
router.get("/me", Auth.authenticateUser, Auth.me);

export default router;
