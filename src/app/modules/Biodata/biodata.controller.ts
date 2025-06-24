import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import { BiodataFilterableFields } from './biodata.constant';
import { BiodataServices } from './biodata.service';

const createABiodata = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;

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

const getAllBiodata = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, BiodataFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await BiodataServices.getAllBiodata(filters, options);

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

const getMyBiodata = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const result = await BiodataServices.getMyBiodata(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Biodata retrieved successfully',
    data: result,
  });
});

const updateMyBiodata = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const result = await BiodataServices.updateMyBiodata(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Biodata updated successfully',
    data: result,
  });
});

const getBiodataByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id: biodataId } = req.params;
  const result = await BiodataServices.getBiodataByAdmin(biodataId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Biodata retrieved successfully',
    data: result,
  });
});

const updateBiodataByAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id: biodataId } = req.params;
  const { userId } = req.user as JwtPayload;

  const result = await BiodataServices.updateBiodataByAdmin(
    biodataId,
    req.body,
    userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Biodata updated successfully',
    data: result,
  });
});

const updateBiodataVisibility = catchAsync(
  async (req: Request, res: Response) => {
    const { id: biodataId } = req.params;
    const result = await BiodataServices.updateBiodataVisibility(
      biodataId,
      req.body,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Biodata status updated successfully',
      data: result,
    });
  },
);

const deleteABiodataRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.user as JwtPayload;

    const result = await BiodataServices.deleteABiodataRequest(
      req.body,
      userId,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Biodata delete request sent successfully',
      data: result,
    });
  },
);

const deleteABiodata = catchAsync(async (req: Request, res: Response) => {
  const { id: BiodataId } = req.params;

  const result = await BiodataServices.deleteABiodata(
    BiodataId,
    req.user as JwtPayload,
  );

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Biodata Deleted successfully',
      data: null,
    });
  }
});

const getBiodataAnalytics = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const result = await BiodataServices.getBiodataAnalytics(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Biodata analytics retrieved successfully',
    data: result,
  });
});

export const BiodataControllers = {
  createABiodata,
  getFilteredBiodata,
  getAllBiodata,
  getABiodata,
  getMyBiodata,
  updateMyBiodata,
  updateBiodataByAdmin,
  getBiodataByAdmin,
  updateBiodataVisibility,
  deleteABiodataRequest,
  deleteABiodata,
  getBiodataAnalytics,
};
