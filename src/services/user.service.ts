import createHttpError from "http-errors";
import { CreateUserRequest, UserResponse } from "../interfaces/user.interfaces";
import bcrypt from "bcryptjs";
import { decodeToken } from "../utils/jwt";
import { CustomJwtPayload } from "../interfaces/jwt.interfaces";
import { db } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const createUser = async (req: CreateUserRequest): Promise<void> => {
  const { email, password } = req;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email!))
    .limit(1)
    .then((x) => x[0]);

  if (existingUser) {
    throw createHttpError(
      409,
      "A user with this email address already exists. Please log in instead."
    );
  }

  const hashedPassword = await bcrypt.hash(password!, 10);

  // const result = await db.insert(users).values({ name: email!, email: email!, passwordHash: hashedPassword }).returning();
  await db
    .insert(users)
    .values({ name: email!, email: email!, passwordHash: hashedPassword });
};

export const findUserByEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserResponse> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .then((x) => x[0]);

  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    throw createHttpError(401, "Invalid credentials");
  }

  return {
    userId: user.id,

    name: user.name,

    email: user.email,
  };
};

export const getAuthenticatedUser = async (
  token: string
): Promise<UserResponse> => {
  const decodedToken = decodeToken(token) as CustomJwtPayload;
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, decodedToken.user.userId))
    .limit(1)
    .then((x) => x[0]);

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return {
    userId: user.id,

    name: user.name,
    email: user.email,
  };
};
