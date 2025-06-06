import z from 'zod';

const updateUserValidationSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
  contactNumber: z.string().length(11).optional(),
  isDeleted: z.boolean().optional(),
  address: z.string().optional(),
  status: z
    .string(z.enum(['PENDING', 'ACTIVE', 'BLOCKED']))
    .nullable()
    .optional(),
  emailConfirmed: z.boolean().nullable().optional(),
  token: z.number().nullable().optional(),
  biodataVisibility: z
    .string(z.enum(['PUBLIC', 'PRIVATE']))
    .nullable()
    .optional(),
});

const updateMyProfileValidationSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
  contactNumber: z.string().length(11).optional(),
  address: z.string().optional(),
});

const giveTokenValidationSchema = z.object({
  token: z.number(),
});

const changeUserStatus = z.object({
  role: z.enum(['ADMIN', 'SUPER_ADMIN']),
});

export const UserValidation = {
  updateUserValidationSchema,
  updateMyProfileValidationSchema,
  giveTokenValidationSchema,
  changeUserStatus,
};
