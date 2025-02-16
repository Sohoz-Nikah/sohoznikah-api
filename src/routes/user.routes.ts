import { Router } from "express";
import {
  createUser,
  getAuthenticatedUser,
} from "../controllers/user.controller";
import { authenticated } from "../middleware/authenticated.middleware";

const router = Router();

router.post("/", createUser);
router.get("/me", authenticated, getAuthenticatedUser);

export default router;
