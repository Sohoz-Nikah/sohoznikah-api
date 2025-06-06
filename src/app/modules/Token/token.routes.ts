import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TokenControllers } from './token.controller';
import { TokenValidation } from './token.validation';

const router = express.Router();

router.post(
  '/',
  auth([UserRole.USER]),
  validateRequest(TokenValidation.createTokenValidationSchema),
  TokenControllers.createAToken,
);

router.get(
  '/',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  TokenControllers.getFilteredToken,
);

router.get(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  TokenControllers.getAToken,
);

router.patch(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  TokenControllers.updateAToken,
);

router.delete(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  TokenControllers.deleteAToken,
);

export const TokenRoutes = router;
