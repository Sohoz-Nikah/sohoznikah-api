import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,

  jwt: {
    access_secret: process.env.JWT_SECRET,
    access_expires_in: process.env.JWT_EXPIRES_IN,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    passwordResetTokenExpirationTime: process.env.PASS_RESET_EXPIRATION_TIME,
  },

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  super_admin: {
    name: process.env.SUPER_ADMIN_NAME,
    email: process.env.SUPER_ADMIN_EMAIL,
    pass: process.env.SUPER_ADMIN_PASS,
    phoneNumber: process.env.SUPER_ADMIN_PHONE,
  },

  send_email: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
  frontend_url: process.env.FRONTEND_URL,
};
