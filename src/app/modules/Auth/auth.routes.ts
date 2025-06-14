import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.createUserValidationSchema),
  AuthControllers.register,
);

router.post(
  '/verify-email',
  validateRequest(AuthValidation.verifyEmailValidationSchema),
  AuthControllers.verifyOtp,
);

router.post(
  '/resend-otp',
  validateRequest(AuthValidation.resendOtpValidationSchema),
  AuthControllers.resendOtp,
);

router.post(
  '/change-email',
  validateRequest(AuthValidation.changeEmailValidationSchema),
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]),
  AuthControllers.changeEmail,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthControllers.refreshToken,
);

router.post(
  '/change-password',
  validateRequest(AuthValidation.changePasswordZodSchema),
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]),
  AuthControllers.changePassword,
);

router.post('/forgot-password', AuthControllers.forgotPass);
router.post('/reset-password', AuthControllers.resetPassword);

export const AuthRoutes = router;
