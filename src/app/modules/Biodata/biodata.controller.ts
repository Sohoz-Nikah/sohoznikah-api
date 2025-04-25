import { Request, Response } from 'express';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import ApiError from '../../errors/ApiError';
import { BiodataServices } from './biodata.service';
import { BiodataFilterableFields } from './biodata.constant';
import { jwtHelpers } from '../../helper/jwtHelpers';
import config from '../../config';

const createABiodata = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
  }
  const { userId } = jwtHelpers.verifyToken(
    token,
    config.jwt.access_secret as string,
  );
  const result = await BiodataServices.createABiodata(req, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Biodata created successfully',
    data: result,
  });
});

const getFilteredBiodata = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, BiodataFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await BiodataServices.getFilteredBiodata(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Biodata retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getABiodata = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BiodataServices.getABiodata(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Biodata retrieved successfully',
    data: result,
  });
});

const updateABiodata = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
  }
  // const { id } = jwtHelpers.verifyToken(
  //   token,
  //   config.jwt.access_secret as Secret,
  // );
  const { id: BiodataId } = req.params;

  const result = await BiodataServices.updateABiodata(BiodataId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Biodata updated successfully',
    data: result,
  });
});

const deleteABiodata = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
  }
  // const { id } = jwtHelpers.verifyToken(
  //   token,
  //   config.jwt.access_secret as Secret,
  // );
  const { id: BiodataId } = req.params;

  const result = await BiodataServices.deleteABiodata(BiodataId);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Biodata Deleted successfully',
      data: null,
    });
  }
});

export const BiodataControllers = {
  createABiodata,
  getFilteredBiodata,
  getABiodata,
  updateABiodata,
  deleteABiodata,
};
