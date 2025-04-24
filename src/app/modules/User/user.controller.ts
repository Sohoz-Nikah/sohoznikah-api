import { Request, Response } from 'express';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import { UserServices } from './user.service';
import { jwtHelpers } from '../../helper/jwtHelpers';
import config from '../../config';
import pick from '../../shared/pick';
import { UserFilterableFields } from './user.constant';
import ApiError from '../../errors/ApiError';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, UserFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await UserServices.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All User retrieved successfully!',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully!',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  const { userId } = jwtHelpers.verifyToken(
    token,
    config.jwt.access_secret as string,
  );
  const result = await UserServices.getMyProfile(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  const { userId } = jwtHelpers.verifyToken(
    token,
    config.jwt.access_secret as string,
  );
  const result = await UserServices.updateMyProfile(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User profile updated successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  const { userId } = jwtHelpers.verifyToken(
    token,
    config.jwt.access_secret as string,
  );

  const { id } = req.params;
  const result = await UserServices.updateUser(userId, id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated Successfully!',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const token = req.headers.authorization as string;
  const { userId } = jwtHelpers.verifyToken(
    token,
    config.jwt.access_secret as string,
  );
  const result = await UserServices.deleteUser(id, userId);

  if (!result.isDeleted) {
    throw new ApiError(
      httpStatus.NOT_IMPLEMENTED,
      'Something went wrong. Please try again.',
    );
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully!',
    data: null,
  });
});

const analytics = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.analytics();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard data retrived successfully!',
    data: result,
  });
});

export const UserControllers = {
  getAllUsers,
  getSingleUser,
  getMyProfile,
  updateMyProfile,
  updateUser,
  deleteUser,
  analytics,
};
