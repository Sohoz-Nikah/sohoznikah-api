import { RequestHandler } from "express";
import * as sessionService from "../services/session.service";
import {
  CreateSessionBody,
  SessionResponse,
} from "../interfaces/session.interfaces";

export const createSession: RequestHandler<
  unknown,
  SessionResponse,
  CreateSessionBody,
  unknown
> = async (req, res, next) => {
  try {
    const token = await sessionService.createToken(req.body);
    res.status(201).json({ isSuccess: true, token: token });
  } catch (error) {
    next(error);
  }
};
