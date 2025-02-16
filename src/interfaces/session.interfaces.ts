export interface CreateSessionBody {
  email?: string;
  password?: string;
}

export interface SessionResponse {
  isSuccess: boolean;
  token?: string;
  message?: string;
}
