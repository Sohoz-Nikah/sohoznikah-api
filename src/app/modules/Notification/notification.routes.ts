import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { NotificationValidation } from './notification.validation';
import { NotificationControllers } from './notification.controller';
import { UserRole } from '@prisma/client';

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
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(NotificationValidation.updateNotificationValidationSchema),
  NotificationControllers.updateANotification,
);

router.delete(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  NotificationControllers.deleteANotification,
);

export const NotificationRoutes = router;
