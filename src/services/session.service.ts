import { CreateSessionRequest } from "../interfaces/session.interfaces";

import * as userService from "../services/user.service";
import { generateToken } from "../utils/jwt";

export const createToken = async (
  req: CreateSessionRequest
): Promise<string> => {
  const { email, password } = req;
  const user = await userService.findUserByEmailAndPassword(email!, password!);
  return generateToken(user);
};
