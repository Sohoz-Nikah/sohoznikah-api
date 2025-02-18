import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));
export const requiredString = z.string().trim();

export const createSessionRequest = z.object({
  email: requiredString
    .email({ message: "Invalid Email" })
    .min(1, { message: "Field is required" }),
  password: requiredString.min(1, { message: "Field is required" }),
});

export const createUserRequest = z.object({
  name: requiredString.min(1, { message: "Field is required" }),
  email: requiredString
    .email({ message: "Invalid Email" })
    .min(1, { message: "Field is required" }),
  password: requiredString.min(1, { message: "Field is required" }),
});

export const forgotPasswordRequest = z.object({
  email: requiredString
    .email({ message: "Invalid Email" })
    .min(1, { message: "Field is required" }),
});

export const resetPasswordRequest = z
  .object({
    password: requiredString.min(1, { message: "Field is required" }),
    confirmPassword: requiredString.min(1, { message: "Field is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export const changePasswordRequest = z
  .object({
    currentPassword: requiredString.min(1, { message: "Field is required" }),
    newPassword: requiredString.min(1, { message: "Field is required" }),
    confirmNewPassword: requiredString.min(1, { message: "Field is required" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password do not match",
    path: ["confirmNewPassword"],
  });
