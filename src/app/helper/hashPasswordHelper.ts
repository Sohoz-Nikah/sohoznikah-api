/* eslint-disable @typescript-eslint/no-explicit-any */
import * as bcrypt from "bcryptjs";
import config from "../config";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";

export const hashedPassword = async (password: string): Promise<string> => {
  const saltRounds: number = Number(config.bcrypt_salt_rounds);
  try {
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err: any) {
    console.error("Error hashing password:", err);
    throw new ApiError(httpStatus.BAD_REQUEST, "Error hashing password");
  }
};
