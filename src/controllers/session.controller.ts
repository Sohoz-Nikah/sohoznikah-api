import { RequestHandler } from "express";
import * as sessionService from "../services/session.service";
import {
  CreateSessionRequest,
  SessionResponse,
} from "../interfaces/session.interfaces";
import { createSessionRequest } from "../utils/validations";
import { SafeParseReturnType } from "zod";

export const createSession: RequestHandler<
  unknown,
  SessionResponse,
  CreateSessionRequest,
  unknown
> = async (req, res, next) => {
  const parsed: SafeParseReturnType<
    CreateSessionRequest,
    CreateSessionRequest
  > = await createSessionRequest.safeParseAsync(req.body);
  if (!parsed.success) {
    next(parsed.error);
  }

  try {
    const token = await sessionService.createToken(parsed.data!);
    res.status(201).json({ isSuccess: true, token: token });
  } catch (error) {
    next(error);
  }
};
