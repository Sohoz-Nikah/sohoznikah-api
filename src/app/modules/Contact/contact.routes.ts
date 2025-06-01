import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ContactControllers } from './contact.controller';
import { ContactValidation } from './contact.validation';

const router = express.Router();

router.post(
  '/',
  auth([UserRole.USER]),
  validateRequest(ContactValidation.createContactValidationSchema),
  ContactControllers.createAContact,
);

router.get(
  '/',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  ContactControllers.getFilteredContact,
);

router.get(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  ContactControllers.getAContact,
);

router.patch(
  '/:id',
  auth([UserRole.USER]),
  ContactControllers.updateContactResponse,
);

router.delete(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  ContactControllers.deleteAContact,
);

export const ContactRoutes = router;
