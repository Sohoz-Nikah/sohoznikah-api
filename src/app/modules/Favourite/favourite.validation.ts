import { z } from 'zod';

const createFavouriteValidationSchema = z.object({
  biodataId: z.string().uuid(),
});

export const FavouriteValidation = {
  createFavouriteValidationSchema,
};
