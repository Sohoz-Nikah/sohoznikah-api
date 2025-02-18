export interface CreateUserRequest {
  email?: string;
  password?: string;
}

export interface UserResponse {
  userId: string;
  name: string;
  email: string;
}
