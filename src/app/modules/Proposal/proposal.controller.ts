import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import { ProposalFilterableFields } from './proposal.constant';
import { ProposalServices } from './proposal.service';

const createAProposal = catchAsync(async (req: Request, res: Response) => {
  const result = await ProposalServices.createAProposal(
    req.body,
    req.user as JwtPayload,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Proposal sent successfully!',
    data: result,
  });
});

const getFilteredProposal = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ProposalFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ProposalServices.getFilteredProposal(
    filters,
    options,
    req.user as JwtPayload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Proposal retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAProposal = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProposalServices.getAProposal(
    id,
    req.user as JwtPayload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Proposal retrieved successfully',
    data: result,
  });
});

// const updateProposalResponse = catchAsync(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const result = await ProposalServices.getAProposal(
//       id,
//       req.body,
//       req.user as JwtPayload,
//     );

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Proposal retrieved successfully',
//       data: result,
//     });
//   },
// );

const deleteAProposal = catchAsync(async (req: Request, res: Response) => {
  const { id: ProposalId } = req.params;

  const result = await ProposalServices.deleteAProposal(ProposalId);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Proposal Deleted successfully',
      data: null,
    });
  }
});

export const ProposalControllers = {
  createAProposal,
  getFilteredProposal,
  getAProposal,
  // updateProposalResponse,
  deleteAProposal,
};
