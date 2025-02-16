import { JwtPayload, sign, verify } from "jsonwebtoken";
import { readFileSync } from "fs";
import { join } from "path";
import { UserResponse } from "../interfaces/user.interfaces";

const PRIVATE_KEY = readFileSync(
  join(__dirname, "../config/keys/private.key"),
  "utf8"
);
const PUBLIC_KEY = readFileSync(
  join(__dirname, "../config/keys/public.key"),
  "utf8"
);

export const generateToken = (user: UserResponse): string => {
  return sign({ user: user }, PRIVATE_KEY, {
    expiresIn: "1h",
    algorithm: "RS256",
  });
};

export const decodeToken = (token: string): JwtPayload | string => {
  return verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
};
