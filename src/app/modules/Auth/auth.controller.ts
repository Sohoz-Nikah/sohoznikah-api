import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import { AuthServices } from './auth.service';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.register(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User Registration successfull!',
    data: result,
  });
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.verifyOtp(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Email Verified successfully!!!',
    data: result,
  });
});

const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.resendOtp(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'OTP resent successfully!!!',
    data: result,
  });
});

const changeEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.changeEmail(req.user, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Email changed successfully!!!',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken } = result;
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.node_env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: result.emailConfirmed
      ? 'User logged in successfully !'
      : 'Please verify your email before login!!!',
    data: {
      email: result.email,
      emailConfirmed: result.emailConfirmed,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.node_env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;

  await AuthServices.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully!',
    data: {
      status: 200,
      message: 'Password changed successfully!',
    },
  });
});

const forgotPass = catchAsync(async (req: Request, res: Response) => {
  await AuthServices.forgotPass(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Check your email!',
    data: {
      status: 200,
      message: 'Check your email for reset link!',
    },
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';
  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token is required');
  }
  await AuthServices.resetPassword(req.body, token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Account recovered!',
    data: {
      status: 200,
      message: 'Password Reset Successfully',
    },
  });
});

export const AuthControllers = {
  register,
  verifyOtp,
  resendOtp,
  changeEmail,
  loginUser,
  refreshToken,
  changePassword,
  forgotPass,
  resetPassword,
};
