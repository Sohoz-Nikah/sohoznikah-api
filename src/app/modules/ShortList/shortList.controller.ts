import { Request, Response } from 'express';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import { ShortlistServices } from './shortList.service';
import { ShortlistFilterableFields } from './shortList.constant';
import { JwtPayload } from 'jsonwebtoken';

const createAShortlist = catchAsync(async (req: Request, res: Response) => {
  const result = await ShortlistServices.createAShortlist(
    req.body,
    req.user as JwtPayload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Added to Shortlist successfully',
    data: result,
  });
});

const getFilteredShortlist = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ShortlistFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ShortlistServices.getFilteredShortlist(filters, options);

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
  const result = await ShortlistServices.getAShortlist(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shortlist retrieved successfully',
    data: result,
  });
});

const deleteAShortlist = catchAsync(async (req: Request, res: Response) => {
  const { id: ShortlistId } = req.params;

  const result = await ShortlistServices.deleteAShortlist(ShortlistId);

  if (result) {
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
