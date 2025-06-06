import { UserRole } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProposalControllers } from './proposal.controller';
import { ProposalValidation } from './proposal.validation';

const router = express.Router();
router.get(
  '/biodata/:id',
  auth([UserRole.USER]),
  ProposalControllers.getProposalByBiodataId,
);

router.post(
  '/',
  auth([UserRole.USER]),
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

router.post(
  '/:id/cancel',
  auth([UserRole.USER]),
  ProposalControllers.cancelProposal,
);

router.patch(
  '/:id',
  auth([UserRole.USER]),
  ProposalControllers.updateProposalResponse,
);

router.delete(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  ProposalControllers.deleteAProposal,
);

export const ProposalRoutes = router;
