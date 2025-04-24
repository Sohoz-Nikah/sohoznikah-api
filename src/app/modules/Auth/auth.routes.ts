import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/register",
  validateRequest(AuthValidation.createUserValidationSchema),
  AuthControllers.register
);

router.post(
  "/verify-email",
  validateRequest(AuthValidation.verifyEmailValidationSchema),
  AuthControllers.verifyOtp
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthControllers.refreshToken
);

router.post(
  "/change-password",
  validateRequest(AuthValidation.changePasswordZodSchema),
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]),
  AuthControllers.changePassword
);

router.post("/forgot-password", AuthControllers.forgotPass);
router.post("/reset-password", AuthControllers.resetPassword);

export const AuthRoutes = router;
