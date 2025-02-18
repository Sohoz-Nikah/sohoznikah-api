import { RequestHandler } from "express";
import { CreateUserRequest, UserResponse } from "../interfaces/user.interfaces";
import * as userService from "../services/user.service";
import { SafeParseReturnType } from "zod";
import { createUserRequest } from "../utils/validations";

export const createUser: RequestHandler<
  unknown,
  unknown,
  CreateUserRequest,
  unknown
> = async (req, res, next) => {
  const parsed: SafeParseReturnType<CreateUserRequest, CreateUserRequest> =
    await createUserRequest.safeParseAsync(req.body);
  if (!parsed.success) {
    next(parsed.error);
  }
  try {
    await userService.createUser(parsed.data!);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};

export const getAuthenticatedUser: RequestHandler<
  unknown,
  UserResponse,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    const user = await userService.getAuthenticatedUser(token!);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
