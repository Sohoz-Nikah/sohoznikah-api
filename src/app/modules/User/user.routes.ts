import express from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  UserControllers.getAllUsers
);

router.get(
  "/dashboard",
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  UserControllers.analytics
);
router.get(
  "/me",
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  UserControllers.getMyProfile
);

router.get(
  "/:id",
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  UserControllers.getSingleUser
);

router.patch(
  "/update-my-profile",
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  validateRequest(UserValidation.updateMyProfileValidationSchema),
  UserControllers.updateMyProfile
);

router.patch(
  "/:id",
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUser
);

router.delete(
  "/:id",
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  UserControllers.deleteUser
);

export const UserRoutes = router;
