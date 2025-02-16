import { RequestHandler } from "express";
import { decodeToken } from "../utils/jwt";
import createHttpError from "http-errors";
import { TokenExpiredError } from "jsonwebtoken";

export const authenticated: RequestHandler = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    next(createHttpError(401, "Unauthorized - no token provided"));
    return;
  }
  try {
    const decodedToken = decodeToken(token!);
    if (!decodedToken) {
      next(createHttpError(401, "Unauthorized - invalid token"));
      return;
    }
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(createHttpError(401, "Unauthorized - invalid token"));
      return;
    }
    next(error);
  }
};
