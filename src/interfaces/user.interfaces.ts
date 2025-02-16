export interface CreateUserBody {
  email?: string;
  password?: string;
}

export interface UserResponse {
  userId: string;
  email: string;
}
