import { UserRole, UserStatus } from '@prisma/client';

export type IUserFilterRequest = {
  searchTerm?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
  role?: UserRole | undefined;
  status?: UserStatus | undefined;
};
