import { Request, Response } from 'express';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import { NotificationServices } from './notification.service';
import { NotificationFilterableFields } from './notification.constant';
import { JwtPayload } from 'jsonwebtoken';

const createANotification = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationServices.createANotification(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Notification created successfully',
    data: result,
  });
});

const getFilteredNotification = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, NotificationFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await NotificationServices.getFilteredNotification(
      filters,
      options,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Notification retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

const getANotification = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const { id } = req.params;
  const result = await NotificationServices.getANotification(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification retrieved successfully',
    data: result,
  });
});

const updateANotification = catchAsync(async (req: Request, res: Response) => {
  const { id: NotificationId } = req.params;

  const result = await NotificationServices.updateANotification(
    NotificationId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification updated successfully',
    data: result,
  });
});

const deleteANotification = catchAsync(async (req: Request, res: Response) => {
  const { id: NotificationId } = req.params;

  const result = await NotificationServices.deleteANotification(NotificationId);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Notification Deleted successfully',
      data: null,
    });
  }
});

export const NotificationControllers = {
  createANotification,
  getFilteredNotification,
  getANotification,
  updateANotification,
  deleteANotification,
};
