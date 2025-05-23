import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ShortlistValidation } from './shortList.validation';
import { ShortlistControllers } from './shortList.controller';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  validateRequest(ShortlistValidation.createShortlistValidationSchema),
  ShortlistControllers.createAShortlist,
);

router.get(
  '/',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  ShortlistControllers.getFilteredShortlist,
);

router.get(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  ShortlistControllers.getAShortlist,
);

router.delete(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  ShortlistControllers.deleteAShortlist,
);

export const ShortlistRoutes = router;
