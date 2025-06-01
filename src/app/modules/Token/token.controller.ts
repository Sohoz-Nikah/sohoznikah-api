import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import { TokenFilterableFields } from './token.constant';
import { TokenServices } from './token.service';

const createAToken = catchAsync(async (req: Request, res: Response) => {
  const result = await TokenServices.createAToken(
    req.body,
    req.user as JwtPayload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Token request send successfully',
    data: result,
  });
});

const getFilteredToken = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, TokenFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await TokenServices.getFilteredToken(
    filters,
    options,
    req.user as JwtPayload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAToken = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const result = await TokenServices.getAToken(id, user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token retrieved successfully',
    data: result,
  });
});

const updateAToken = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;
  const result = await TokenServices.updateAToken(id, req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token updated successfully',
    data: result,
  });
});

const deleteAToken = catchAsync(async (req: Request, res: Response) => {
  const { id: TokenId } = req.params;
  const user = req.user as JwtPayload;

  const result = await TokenServices.deleteAToken(TokenId, user);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Token Deleted successfully',
      data: null,
    });
  }
});

export const TokenControllers = {
  createAToken,
  getFilteredToken,
  getAToken,
  updateAToken,
  deleteAToken,
};
