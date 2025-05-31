import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { NotificationControllers } from './notification.controller';
import { NotificationValidation } from './notification.validation';

const router = express.Router();

router.post(
  '/',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(NotificationValidation.createNotificationValidationSchema),
  NotificationControllers.createANotification,
);

router.get(
  '/',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  NotificationControllers.getFilteredNotification,
);

router.get(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  NotificationControllers.getANotification,
);

router.patch(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  validateRequest(NotificationValidation.updateNotificationValidationSchema),
  NotificationControllers.updateANotification,
);

router.delete(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  NotificationControllers.deleteANotification,
);

export const NotificationRoutes = router;
