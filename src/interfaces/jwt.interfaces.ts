import { JwtPayload } from "jsonwebtoken";
import { UserResponse } from "./user.interfaces";

export interface CustomJwtPayload extends JwtPayload {
  user: UserResponse;
}
