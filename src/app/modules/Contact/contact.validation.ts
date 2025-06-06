import { z } from 'zod';

const createContactValidationSchema = z.object({
  biodataId: z.string().uuid(),
});

export const ContactValidation = {
  createContactValidationSchema,
};
