import { UserRole, UserStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import ApiError from '../errors/ApiError';
import catchAsync from '../shared/catchAsync';
import prisma from '../shared/prisma';
import isJWTIssuedBeforePasswordChanged from './isJWTIssuedBeforePasswordChanged';

const auth = (requiredRoles: string[] = []) => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Missing or malformed authorization token!',
        );
      }

      const token = authHeader;

      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(
          token,
          config.jwt.access_secret as string,
        ) as JwtPayload;
      } catch {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Invalid or expired token!',
        );
      }

      const { userId, role, iat } = decoded;

      if (!userId || !role) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token!');
      }

      // Fetch user, role, and status in ONE optimized query
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          isDeleted: true,
          status: true,
          role: true,
          passwordChangedAt: true,
        },
      });

      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User does not exist!');
      }
      if (user.isDeleted) {
        throw new ApiError(httpStatus.FORBIDDEN, 'User is deleted!');
      }
      // if (user.status === UserStatus.PENDING) {
      //   throw new ApiError(httpStatus.FORBIDDEN, "User status is pending!");
      // }
      if (user.status === UserStatus.BLOCKED) {
        throw new ApiError(httpStatus.FORBIDDEN, 'User is blocked!');
      }

      // Check if the token was issued before password change
      if (
        user.passwordChangedAt &&
        isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
      ) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Token issued before password change!',
        );
      }

      // ✅ Grant full access if the user is a SUPER_ADMIN
      if (user.role === UserRole.SUPER_ADMIN) {
        req.user = decoded as JwtPayload & { role: string };
        return next();
      }

      // ✅ Check role-based access for other users
      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Access denied!');
      }

      // ✅ Check route-specific permissions for non-superadmins
      req.user = decoded as JwtPayload & { role: string };
      next();
    },
  );
};

export default auth;
