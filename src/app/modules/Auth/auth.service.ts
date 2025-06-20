import { User, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Request } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { exclude } from '../../helper/exclude';
import { hashedPassword } from '../../helper/hashPasswordHelper';
import { jwtHelpers } from '../../helper/jwtHelpers';
import { sendEmail } from '../../helper/sendEmail';
import prisma from '../../shared/prisma';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { AuthUtils } from './auth.utils';

const register = async (req: Request): Promise<Partial<User>> => {
  const { name, email, phoneNumber, accountType, password } = req.body;
  // Check if the user already exists
  const user = await prisma.user.findUnique({
    where: {
      email: email,
      phoneNumber: phoneNumber,
    },
  });

  if (user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User already exists');
  }

  // Hash the password
  const hashedPassword: string = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  // Generate OTP and expiry
  const otp = crypto.randomInt(100000, 999999);
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

  // Save user details along with OTP and its expiry in the database
  const result = await prisma.user.create({
    data: {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      passwordHash: hashedPassword,
      accountType: accountType,
      otp: otp,
      otpExpiry: otpExpiry,
    },
  });

  // Remove sensitive data
  const safeUser = exclude(result, [
    'emailConfirmed',
    'passwordHash',
    'refreshToken',
    'refreshTokenExpiryTime',
    'lockoutEnabled',
    'lockoutEnd',
    'failedAccessCount',
    'otp',
    'otpExpiry',
    'passwordChangedAt',
    'createdBy',
    'updatedBy',
    'createdAt',
    'updatedAt',
  ]);

  // Email verification link with OTP
  const verfiryLink: string = `${config.frontend_url}/verify-email?email=${req.body.email}&otp=${otp}`;

  // Email content
  const subject = 'Verify Your Email';
  await sendEmail(
    req.body.email,
    subject,
    `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #4CAF50;">Email Verification</h2>
      <p>Dear ${req.body.name},</p>
      <p>Thank you for registering with SohozNikah. Please use the OTP below to verify your email:</p>
      <h3 style="color: #4CAF50;">${otp}</h3>
      <p>Or click the button below to verify directly:</p>
      <a href="${verfiryLink}" style="text-decoration: none; margin-top: 20px;">
        <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Verify Email</button>
      </a>
      <p>If you did not create an account, please ignore this email.</p>
      <p>Best regards,</p>
      <p>The SohozNikah Team</p>
    </div>
    `,
  );

  return safeUser;
};

const verifyOtp = async (payload: Partial<User>) => {
  const { email, otp } = payload;

  // Validate input
  if (!email || !otp || typeof otp !== 'number') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email or OTP provided');
  }

  // Fetch required user fields
  const user = await prisma.user.findUnique({
    where: { email },
    select: { otp: true, otpExpiry: true },
  });

  if (!user || !user.otp || !user.otpExpiry) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found or no OTP found');
  }

  // Check OTP validity and expiration
  if (user.otp !== otp || new Date() > user.otpExpiry) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
  }

  // Activate user and clear OTP fields
  await prisma.user.updateMany({
    where: { email, otp, otpExpiry: { gte: new Date() } }, // Ensure valid OTP
    data: {
      emailConfirmed: true,
      otp: null,
      otpExpiry: null,
      status: UserStatus.ACTIVE,
    },
  });
};

const resendOtp = async (payload: Partial<User>) => {
  const { email } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const otp = crypto.randomInt(100000, 999999);
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

  const result = await prisma.user.update({
    where: { email },
    data: { otp, otpExpiry },
  });

  // Remove sensitive data
  const safeUser = exclude(result, [
    'emailConfirmed',
    'passwordHash',
    'refreshToken',
    'refreshTokenExpiryTime',
    'lockoutEnabled',
    'lockoutEnd',
    'failedAccessCount',
    'otp',
    'otpExpiry',
    'passwordChangedAt',
    'createdBy',
    'updatedBy',
    'createdAt',
    'updatedAt',
  ]);

  // Email verification link with OTP
  const verfiryLink: string = `${config.frontend_url}/verify-email?email=${email}&otp=${otp}`;

  // Email content
  const subject = 'Verify Your Email';

  await sendEmail(
    user.email,
    subject,
    `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #4CAF50;">Email Verification</h2>
    <p>Dear ${user.name},</p>
    <p>Thank you for requesting for new OTP with SohozNikah. Please use the OTP below to verify your email:</p>
    <h3 style="color: #4CAF50;">${otp}</h3>
    <p>Or click the button below to verify directly:</p>
    <a href="${verfiryLink}" style="text-decoration: none; margin-top: 20px;">
      <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Verify Email</button>
    </a>
    <p>If you did not create an account, please ignore this email.</p>
    <p>Best regards,</p>
    <p>The SohozNikah Team</p>
  </div>
  `,
  );

  return safeUser;
};

const changeEmail = async (user: JwtPayload | null, payload: Partial<User>) => {
  const { email } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { id: user?.userId },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const otp = crypto.randomInt(100000, 999999);
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

  const result = await prisma.user.update({
    where: { id: isUserExist.id },
    data: { email, otp, otpExpiry },
  });

  // Remove sensitive data
  const safeUser = exclude(result, [
    'emailConfirmed',
    'passwordHash',
    'refreshToken',
    'refreshTokenExpiryTime',
    'lockoutEnabled',
    'lockoutEnd',
    'failedAccessCount',
    'otp',
    'otpExpiry',
    'passwordChangedAt',
    'createdBy',
    'updatedBy',
    'createdAt',
    'updatedAt',
  ]);

  // Email verification link with OTP
  const verfiryLink: string = `${config.frontend_url}/verify-email?email=${email}&otp=${otp}`;

  // Email content
  const subject = 'Verify Your Email';
  await sendEmail(
    safeUser.email,
    subject,
    `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #4CAF50;">Email Verification</h2>
    <p>Dear ${safeUser.name},</p>
    <p>Thank you for changing your email with SohozNikah. Please use the OTP below to verify your email:</p>
    <h3 style="color: #4CAF50;">${otp}</h3>
    <p>Or click the button below to verify directly:</p>
    <a href="${verfiryLink}" style="text-decoration: none; margin-top: 20px;">
      <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Verify Email</button>
    </a>
    <p>If you did not create an account, please ignore this email.</p>
    <p>Best regards,</p>
    <p>The SohozNikah Team</p>
  </div>
  `,
  );

  return safeUser;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  // Find user by email with role and status included
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // Check if user is deleted before checking the password
  if (isUserExist.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User is Deleted!!!');
  }

  // Check if user status before checking the password
  if (isUserExist.status === UserStatus.BLOCKED) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Your account is Blocked. Please contact support!!!',
    );
  }
  // if (isUserExist.status === UserStatus.PENDING) {
  //   throw new ApiError(
  //     httpStatus.FORBIDDEN,
  //     'Please verify you email before login!!!',
  //   );
  // }

  // Check password only if the user exists and is not deleted
  if (
    isUserExist.passwordHash &&
    !(await AuthUtils.comparePasswords(password, isUserExist.passwordHash))
  ) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Password is incorrect');
  }

  const { id: userId, role, emailConfirmed } = isUserExist;

  // Generate JWT tokens
  const accessToken = jwtHelpers.createToken(
    { userId, role, email },
    config.jwt.access_secret as string,
    config.jwt.access_expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string,
  );

  return {
    email,
    emailConfirmed,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as string,
    );
  } catch {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId, role } = verifiedToken;

  // Find user by email with role and status included
  const isUserExist = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // Check if user is deleted before checking the password
  if (isUserExist.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User is Deleted!!!');
  }

  // Check if user status before checking the password
  if (isUserExist.status === UserStatus.PENDING) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Your account is under review. Please contact support!!!',
    );
  }
  if (isUserExist.status === UserStatus.BLOCKED) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Your account is Blocked. Please contact support!!!',
    );
  }

  // Generate new access token
  const newAccessToken = jwtHelpers.createToken(
    { userId: isUserExist.id, role },
    config.jwt.access_secret as string,
    config.jwt.access_expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: { id: user?.userId, status: UserStatus.ACTIVE },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // checking old password
  if (
    isUserExist.passwordHash &&
    !(await AuthUtils.comparePasswords(oldPassword, isUserExist.passwordHash))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }

  const hashPassword = await hashedPassword(newPassword);

  await prisma.user.update({
    where: {
      id: isUserExist.id,
    },
    data: {
      passwordHash: hashPassword,
      passwordChangedAt: new Date(),
    },
  });
};

const forgotPass = async (email: string) => {
  // Fetch only required fields (avoid unnecessary data)
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  // Generate password reset token
  const passResetToken = jwtHelpers.createPasswordResetToken({ id: user.id });

  // Construct reset password link
  const resetLink = `${config.frontend_url}/reset-password?id=${user.id}&token=${passResetToken}`;

  // Ensure role is properly formatted
  const userRole = user.role || UserRole.USER; // Fallback if role is null/undefined

  // Email subject and content
  const subject = 'Reset Your Password';
  const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 20px; color: #333; }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd; }
        .header h1 { margin: 0; font-size: 24px; color: #007bff; }
        .content { padding: 20px; }
        .content p { margin-bottom: 15px; line-height: 1.5; }
        .button-container { text-align: center; margin-top: 20px; }
        .button { padding: 10px 20px; color: #fff; background-color: #007bff;
          text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; }
        .button:hover { background-color: #0056b3; }
        .footer { margin-top: 20px; text-align: center; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${userRole}</strong>,</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <div class="button-container">
            <a href="${resetLink}" class="button">Reset Password</a>
          </div>
          <p>If you did not request this password reset, please ignore this email. The link will expire in <strong>30 minutes</strong>.</p>
        </div>
        <div class="footer">
          <p>Thank you,</p>
          <p>The SohozNikah Team</p>
          <p><a href="mailto:sohoznikah@gmail.com">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>`;

  // Send email
  await sendEmail(email, subject, emailContent);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  // Verify reset token first (Prevents unnecessary DB query)
  const decoded = jwtHelpers.verifyToken(
    token,
    config.jwt.access_secret as string, // Use reset token secret
  );

  if (!decoded || !decoded.id || decoded.id !== payload.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token!');
  }

  // Fetch only necessary user fields
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true }, // Fetch only the ID (performance improvement)
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // Update password using transaction (ensures atomic update)
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    }),
  ]);
};

export const AuthServices = {
  register,
  verifyOtp,
  resendOtp,
  changeEmail,
  loginUser,
  changePassword,
  refreshToken,
  forgotPass,
  resetPassword,
};
