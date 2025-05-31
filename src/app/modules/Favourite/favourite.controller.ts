import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import { FavouriteFilterableFields } from './favourite.constant';
import { FavouriteServices } from './favourite.service';

const createAFavourite = catchAsync(async (req: Request, res: Response) => {
  const result = await FavouriteServices.createAFavourite(
    req.body,
    req.user as JwtPayload,
  );

  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Added to Favourite successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Deleted from Favourite successfully',
      data: null,
    });
  }
});

const getFilteredFavourite = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, FavouriteFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await FavouriteServices.getFilteredFavourite(
    filters,
    options,
    req.user as JwtPayload,
  );

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
  const user = req.user as JwtPayload;
  const result = await FavouriteServices.getAFavourite(id, user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Favourite retrieved successfully',
    data: result,
  });
});

const deleteAFavourite = catchAsync(async (req: Request, res: Response) => {
  const { id: FavouriteId } = req.params;
  const user = req.user as JwtPayload;

  const result = await FavouriteServices.deleteAFavourite(FavouriteId, user);

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
