import { z } from 'zod';

const createShortlistValidationSchema = z.object({
  biodataId: z.string().uuid(),
});

export const ShortlistValidation = {
  createShortlistValidationSchema,
};
