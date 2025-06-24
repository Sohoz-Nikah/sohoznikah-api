import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

import { UserRole } from '@prisma/client';
import { BiodataControllers } from './biodata.controller';
import {
  updateBiodataValidationSchema,
  updateBiodataVisibilityValidationSchema,
} from './biodata.validation';

const router = express.Router();

router.post(
  '/',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  // validateRequest(createBiodataValidationSchema),

  BiodataControllers.createABiodata,
);

router.get('/', BiodataControllers.getFilteredBiodata);

router.get(
  '/all',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  BiodataControllers.getAllBiodata,
);

router.get(
  '/analytics',
  auth([UserRole.USER]),
  BiodataControllers.getBiodataAnalytics,
);

router.get(
  '/my-biodata',
  auth([UserRole.USER]),
  BiodataControllers.getMyBiodata,
);

router.patch(
  '/my-biodata',
  auth([UserRole.USER]),
  validateRequest(updateBiodataValidationSchema),
  BiodataControllers.updateMyBiodata,
);

router.post(
  '/delete-request',
  auth([UserRole.USER]),
  BiodataControllers.deleteABiodataRequest,
);

router.post('/:id/seen', auth([UserRole.USER]), BiodataControllers.markAsSeen);

router.get('/:id', BiodataControllers.getABiodata);

router.get(
  '/:id/admin',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  BiodataControllers.getBiodataByAdmin,
);

router.patch(
  '/:id/status',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(updateBiodataVisibilityValidationSchema),
  BiodataControllers.updateBiodataVisibility,
);

router.patch(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(updateBiodataValidationSchema),
  BiodataControllers.updateBiodataByAdmin,
);

router.delete(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  BiodataControllers.deleteABiodata,
);

export const BiodataRoutes = router;
