import { z } from 'zod';

const createProposalValidationSchema = z.object({
  biodataId: z.string().uuid(),
});

export const ProposalValidation = {
  createProposalValidationSchema,
};
