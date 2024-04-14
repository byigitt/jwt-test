import { Router } from "express";
import User from "../../../controllers/Users.js";

const router = Router();

router.get("/", User.getUsers);
router.get("/:id", User.getUser);
router.delete("/:id", User.deleteUser);
router.put("/:id", User.updateUser);

export default router;
