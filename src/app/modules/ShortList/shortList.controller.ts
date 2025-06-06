import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import { ShortlistFilterableFields } from './shortList.constant';
import { ShortlistServices } from './shortList.service';

const createAShortlist = catchAsync(async (req: Request, res: Response) => {
  const result = await ShortlistServices.createAShortlist(
    req.body,
    req.user as JwtPayload,
  );
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Added to Shortlist successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Deleted from Shortlist successfully',
      data: null,
    });
  }
});

const getFilteredShortlist = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ShortlistFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ShortlistServices.getFilteredShortlist(
    filters,
    options,
    req.user as JwtPayload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shortlist retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAShortlist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const result = await ShortlistServices.getAShortlist(id, user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shortlist retrieved successfully',
    data: result,
  });
});

const deleteAShortlist = catchAsync(async (req: Request, res: Response) => {
  const { id: ShortlistId } = req.params;

  const result = await ShortlistServices.deleteAShortlist(
    ShortlistId,
    req.user as JwtPayload,
  );

  if (result || result === null) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Shortlist Deleted successfully',
      data: null,
    });
  }
});

export const ShortlistControllers = {
  createAShortlist,
  getFilteredShortlist,
  getAShortlist,
  deleteAShortlist,
};
