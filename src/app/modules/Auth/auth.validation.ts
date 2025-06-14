import z from 'zod';

const createUserValidationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const verifyEmailValidationSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .email({
      message: 'Email must be a valid email address.',
    }),
  otp: z.number({
    required_error: 'OTP is required',
  }),
});

const resendOtpValidationSchema = z.object({
  email: z.string().email(),
});

const loginValidationSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .email({
      message: 'Email must be a valid email address.',
    }),
  password: z.string({
    required_error: 'Password is required',
  }),
});

const changePasswordZodSchema = z.object({
  oldPassword: z.string({
    required_error: 'Old password  is required',
  }),
  newPassword: z.string({
    required_error: 'New password  is required',
  }),
});

const refreshTokenZodSchema = z.object({
  refreshToken: z.string({
    required_error: 'Refresh Token is required',
  }),
});

const changeEmailValidationSchema = z.object({
  email: z.string().email(),
});

export const AuthValidation = {
  createUserValidationSchema,
  verifyEmailValidationSchema,
  loginValidationSchema,
  changePasswordZodSchema,
  refreshTokenZodSchema,
  resendOtpValidationSchema,
  changeEmailValidationSchema,
};
