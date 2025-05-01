import { Request, Response } from 'express';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import { FavouriteServices } from './favourite.service';
import { FavouriteFilterableFields } from './favourite.constant';
import { JwtPayload } from 'jsonwebtoken';

const createAFavourite = catchAsync(async (req: Request, res: Response) => {
  const result = await FavouriteServices.createAFavourite(
    req.body,
    req.user as JwtPayload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Added to Favourite successfully',
    data: result,
  });
});

const getFilteredFavourite = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, FavouriteFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await FavouriteServices.getFilteredFavourite(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favourite retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAFavourite = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FavouriteServices.getAFavourite(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favourite retrieved successfully',
    data: result,
  });
});

const deleteAFavourite = catchAsync(async (req: Request, res: Response) => {
  const { id: FavouriteId } = req.params;

  const result = await FavouriteServices.deleteAFavourite(FavouriteId);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Favourite Deleted successfully',
      data: null,
    });
  }
});

export const FavouriteControllers = {
  createAFavourite,
  getFilteredFavourite,
  getAFavourite,
  deleteAFavourite,
};
