import { z } from 'zod';

const createProposalValidationSchema = z.object({
  biodataId: z.string().uuid(),
});

const updateProposalResponseValidationSchema = z.object({
  response: z.enum(['ACCEPTED', 'REJECTED', 'NEED_TIME']),
});

export const ProposalValidation = {
  createProposalValidationSchema,
  updateProposalResponseValidationSchema,
};
