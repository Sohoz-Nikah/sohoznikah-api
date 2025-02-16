import createHttpError from "http-errors";
import { CreateUserBody, UserResponse } from "../interfaces/user.interfaces";
import bcrypt from "bcryptjs";
import { decodeToken } from "../utils/jwt";
import { CustomJwtPayload } from "../interfaces/jwt.interfaces";
import prisma from "../config/prisma";

export const createUser = async (body: CreateUserBody): Promise<void> => {
  const { email, password } = body;

  if (!email || !password) {
    throw createHttpError(400, "Parameters missing");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw createHttpError(
      409,
      "A user with this email address already exists. Please log in instead."
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { email, passwordHash: hashedPassword },
  });
};

export const findUserByEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserResponse> => {
  if (!email || !password) {
    throw createHttpError(400, "Parameters missing");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    throw createHttpError(401, "Invalid credentials");
  }

  return {
    userId: user.id,

    email: user.email,
  };
};

export const getAuthenticatedUser = async (
  token: string
): Promise<UserResponse> => {
  const decodedToken = decodeToken(token) as CustomJwtPayload;
  const user = await prisma.user.findUnique({
    where: { id: decodedToken.user.userId },
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return {
    userId: user.id,
    email: user.email,
  };
};
