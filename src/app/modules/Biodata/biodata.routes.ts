import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

import { UserRole } from '@prisma/client';
import { BiodataControllers } from './biodata.controller';
import { updateBiodataValidationSchema } from './biodata.validation';

const router = express.Router();

router.post(
  '/',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  // validateRequest(createBiodataValidationSchema),

  BiodataControllers.createABiodata,
);

router.get('/', BiodataControllers.getFilteredBiodata);

router.get('/:id', BiodataControllers.getABiodata);

router.patch(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(updateBiodataValidationSchema),
  BiodataControllers.updateABiodata,
);

router.delete(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  BiodataControllers.deleteABiodata,
);

export const BiodataRoutes = router;
