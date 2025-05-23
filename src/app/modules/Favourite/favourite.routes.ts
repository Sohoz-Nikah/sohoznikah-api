import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FavouriteControllers } from './favourite.controller';
import { FavouriteValidation } from './favourite.validation';

const router = express.Router();

router.post(
  '/',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  validateRequest(FavouriteValidation.createFavouriteValidationSchema),
  FavouriteControllers.createAFavourite,
);

router.get(
  '/',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  FavouriteControllers.getFilteredFavourite,
);

router.get(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  FavouriteControllers.getAFavourite,
);

router.delete(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  FavouriteControllers.deleteAFavourite,
);

export const FavouriteRoutes = router;
