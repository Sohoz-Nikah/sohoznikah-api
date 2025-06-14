export type ILoginUserResponse = {
  email: string;
  emailConfirmed: boolean;
  accessToken: string;
  refreshToken?: string;
};

export type ILoginUser = {
  email: string;
  password: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};
