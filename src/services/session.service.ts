import createHttpError from "http-errors";
import { CreateSessionBody } from "../interfaces/session.interfaces";

import * as userService from "../services/user.service";
import { generateToken } from "../utils/jwt";

export const createToken = async (body: CreateSessionBody): Promise<string> => {
  const { email, password } = body;

  if (!email || !password) {
    throw createHttpError(400, "Parameters missing");
  }
  const user = await userService.findUserByEmailAndPassword(email, password);
  return generateToken(user);
};
