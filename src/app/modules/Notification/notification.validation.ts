import { z } from 'zod';

const createNotificationValidationSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  message: z.string().min(1, 'Message is required'),
  userId: z.string().uuid(),
  biodataId: z.string().uuid().optional().nullable(),
  isGlobal: z.boolean().optional().default(false),
});

const updateNotificationValidationSchema = z.object({
  type: z.string().min(1, 'Type is required').optional(),
  message: z.string().min(1, 'Message is required').optional(),
  userId: z.string().uuid().optional(),
  biodataId: z.string().uuid().optional().nullable(),
  isGlobal: z.boolean().optional().default(false),
});

export const NotificationValidation = {
  createNotificationValidationSchema,
  updateNotificationValidationSchema,
};
