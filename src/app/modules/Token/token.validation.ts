import { z } from 'zod';

const createTokenValidationSchema = z.object({
  phoneNumber: z.string().min(11).max(15),
  quantity: z.number().min(1).nonnegative(),
  tokenType: z.string().min(1),
  totalPrice: z.number().min(1).nonnegative(),
  transactionId: z.string().min(3),
});

export const TokenValidation = {
  createTokenValidationSchema,
};
