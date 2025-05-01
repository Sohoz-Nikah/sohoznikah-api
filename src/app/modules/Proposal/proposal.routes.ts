import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProposalValidation } from './proposal.validation';
import { ProposalControllers } from './proposal.controller';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  validateRequest(ProposalValidation.createProposalValidationSchema),
  ProposalControllers.createAProposal,
);

router.get(
  '/',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  ProposalControllers.getFilteredProposal,
);

router.get(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  ProposalControllers.getAProposal,
);

router.delete(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  ProposalControllers.deleteAProposal,
);

export const ProposalRoutes = router;
