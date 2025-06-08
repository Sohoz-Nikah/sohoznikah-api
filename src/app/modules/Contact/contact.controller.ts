import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import { ContactFilterableFields } from './contact.constant';
import { ContactServices } from './contact.service';

const createAContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.createAContact(
    req.body,
    req.user as JwtPayload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Contact sent successfully!',
    data: result,
  });
});

const getContactByBiodataId = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ContactServices.getContactByBiodataId(
      id,
      req.user as JwtPayload,
      req.query,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Contact retrieved successfully',
      data: result,
    });
  },
);

const getFilteredContact = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ContactFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ContactServices.getFilteredContact(
    filters,
    options,
    req.user as JwtPayload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ContactServices.getAContact(id, req.user as JwtPayload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact retrieved successfully',
    data: result,
  });
});

const updateContactResponse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ContactServices.updateContactResponse(
      id,
      req.body,
      req.user as JwtPayload,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Contact response updated successfully',
      data: result,
    });
  },
);

const getMyContact = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactServices.getMyContact(req.user as JwtPayload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Contact retrieved successfully',
    data: result,
  });
});

const deleteAContact = catchAsync(async (req: Request, res: Response) => {
  const { id: ContactId } = req.params;

  const result = await ContactServices.deleteAContact(
    ContactId,
    req.user as JwtPayload,
  );

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Contact Deleted successfully',
      data: null,
    });
  }
});

export const ContactControllers = {
  createAContact,
  getFilteredContact,
  getContactByBiodataId,
  getAContact,
  updateContactResponse,
  deleteAContact,
  getMyContact,
};
